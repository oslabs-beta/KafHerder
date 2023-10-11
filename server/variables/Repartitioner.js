const { Kafka } = require('kafkajs');

class TopicRepartitioner {
    constructor (props) {
        this.props = props; // consists of a seedBrokerUrl <String>, oldTopic <Topic>, newTopicName <String>
        this.groups = [];
        this.hasFinished = false;
        this.oldTopic = props.oldTopic;
    }
    async run(){
        console.log('now running repartitioning process');
        let newPartitionNum = 0;
        for (const [consumerOffsetConfig, partitionNumArr] of Object.entries(this.oldTopic.consumerOffsetConfigs)){
            console.log('creating rpGroup');
            const rpGroup = new RepartitionerGroup(this.props, this, consumerOffsetConfig);
            this.groups.push(rpGroup);
            for (const oldPartitionNum of partitionNumArr){
                const id = `${consumerOffsetConfig}-${oldPartitionNum}/${newPartitionNum}`;
                console.log('creating rpAgent');
                const rpAgent = new RepartitionerAgent(this.props, rpGroup, oldPartitionNum, newPartitionNum, id);
                rpGroup.agents.push(rpAgent);
                console.log('starting rpAgent');
                await rpAgent.start();
            }
            newPartitionNum++;
        }

        // run everything
        if (this.hasFinished){
            // return final result
        }
    }
    checkIfFinished(){
        for (const group of this.groups){
            if (group.hasFinished === false) return false;
        }
        return this.hasFinished = true;
    }  
}

class RepartitionerGroup {
    constructor (props, topicRp, consumerOffsetConfig){
        this.props = props;
        this.consumerOffsetConfig = consumerOffsetConfig;
        this.agents = [];
        this.hasFinished = false;
        this.producerOffset = 0; // defined here because all its agents will always be writing to one partition
        // even if we have multiple ABC configs, you need to split them up in the Topic object, not here
    }
    addAgent(props, rpGroup, oldPartitionNum, newPartitionNum, id){
        // unnecessary
    }
    startAll(){
        // unnecessary
    }
    allPaused(){
        for (const agent of this.agents){
            if (agent.isPaused === false) return false;
        }
        return true; // resumeAll() will be called on agent level for clarity
    }
    resumeAll(){
        for (const agent of this.agents){
            console.log(`resuming agent ${agent.id}`);
            agent.isPaused = false;
            agent.resume();
        }
    }
    allFinished(){
        for (const agent of this.agents){
            if (agent.hasFinished === false) return false;
        }
        return this.hasFinished = true;
    }  
}

// each RepartitionerAgent consists of one consumer reading from one partition in and old topic
// and one producer writing to one partition in a new topic
// the logic lies in making sure the agent only reads (and writes) to a stopping point (the first consumerOffset in the config)
// then pauses and remains paused until ALL the agents in the RepartitionerGroup have reached their stopping points
// then all resume in tandem to read until their next respective stopping points
// because all partitions being read by agents in a RepartitionerGroup have the same consumer offset configurations
// this means we are guaranteeing the exactly-once processing of messages in the new partition
// TODO: make sure your last stopping point is the END of the partition, not the last offset
// TODO: for the LAST consumer to pause at the nth stopping point
// make sure it records its offset position so the future consumer knows where to pick off from - DONE
// TODO: make sure to add try catches
class RepartitionerAgent {
    constructor (props, rpGroup, oldPartitionNum, newPartitionNum, id){
        this.seedBrokerUrl = props.seedBrokerUrl;
        this.oldTopic = props.oldTopic;
        this.newTopicName = props.newTopicName;

        this.rpGroup = rpGroup; // required to access allPaused, resumeAll, and allFinished methods
        this.oldPartitionNum = Number(oldPartitionNum); // TODO: WHY IS THIS A STRING?
        this.newPartitionNum = newPartitionNum; // this ISN'T a string
        this.id = id;

        this.hasStarted = false;
        this.stoppingPoint = this.oldTopic.partitions[oldPartitionNum].consumerOffsetLL.head; // consumerOffsetNode
        this.endNode = this.oldTopic.partitions[oldPartitionNum].consumerOffsetLL.tail;
        this.isPaused = false;
        this.hasFinished = false;
        this.producer;
        this.consumer;
        this.consumerOffset;
        this.resume;
        this.allMessagesProcessed = false;
    }
    async createProducer(){
        const clientIdProducer = 'producer-'+this.id;
        const kafka = new Kafka({
            clientId: clientIdProducer,
            brokers: [this.seedBrokerUrl]
        })
        this.producer = kafka.producer({
            allowAutoTopicCreation: false,
            transactionTimeout: 300000
        });
        await this.producer.connect();
    }
    async createConsumer(){
        const clientIdConsumer = 'Bconsumer-'+this.id;
        const kafka = new Kafka({
            clientId: clientIdConsumer,
            brokers: [this.seedBrokerUrl]
        })
        // NOTE: every consumer must have its own group in order to guarantee one consumer per partition
        // this will be explained more in consumer.seek() at the end of this.start()
        this.consumer = kafka.consumer({
            groupId: clientIdConsumer,
        });
        await this.consumer.connect();

        // for consumer.subscribe(), do NOT use fromBeginning: true
        // we are deliberately setting the offsets for this consumer group for every partition to the end
        // then, we are going to change the offset of just the desired partition to 0 in consumer.seek() at the end of this.start() below
        await this.consumer.subscribe({ topics: [this.oldTopic.name] }); // fromBeginning should be false
    }
    pauseAndResumeWhenReady(pause){
        this.resume = pause(); // pause() returns a resuming function
        this.isPaused = true;

        if (this.rpGroup.allPaused()){
            // this is where you would write the logic for the new consumer offsets. currently a console.log:
            console.log(`On partition ${this.newPartitionNum}, consumer group ${this.stoppingPoint.consumerGroupId}'s new offset will be ${this.rpGroup.producerOffset}`) // +1?
            this.stoppingPoint = this.stoppingPoint.next;
            // resume all if all paused
            this.rpGroup.resumeAll();
        } else {
            // if they are not all paused, remain paused but move the stopping point
            this.stoppingPoint = this.stoppingPoint.next; // not very DRY
        }            
    }

    async end(){
        this.hasFinished = true;
        
        if (this.rpGroup.allFinished()){
            console.log(`All agents in rpGroup ${this.rpGroup.consumerOffsetConfig} have finished.`);
        }
        console.log('disconnecting consumer and producer');
        await this.consumer.disconnect();
        await this.producer.disconnect();
    }

    async writeMessage(value){ // you can add in key later
        const result = await this.producer.send({ 
            topic: this.newTopicName,
            messages: [
                { value, partition: this.newPartitionNum } 
            ],
        });
        this.rpGroup.producerOffset++;
    }

    // MAIN FUNCTION
    async start(){
        await this.createProducer();
        await this.createConsumer();

        // processing messages:
        this.consumer.run({ // do not put await here according to the requirements of consumer.seek() after this
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

                // reading message
                const value = message.value.toString();
                this.consumerOffset = message.offset;
                // console.log({ moving: `${this.oldPartitionNum}->${this.newPartitionNum}`, value, consumerOffset: this.consumerOffset })
                // if (Number(this.consumerOffset) > 375) console.log({ moving: `${this.oldPartitionNum}->${this.newPartitionNum}`, value, consumerOffset: this.consumerOffset });
                if (Number(this.consumerOffset) > 375) console.log(`end node offset: ${Object.keys(this.endNode)}`);


                // MAIN LOGIC
                if (this.consumerOffset === this.stoppingPoint.offset) { // has reached stopping point
                    console.log('reached stopping point: ', this.stoppingPoint)
                    this.pauseAndResumeWhenReady(pause); // this breaks out of eachMessage, moves the stopping point, and resumes from the same message when all have reached the previous stopping point
                }
                else if (Number(this.consumerOffset) === Number(this.endNode.offset)-1) { // is last message
                    console.log('reached last message: ', this.consumerOffset);
                    if (!this.allMessagesProcessed){ // write the message if it hasn't been written
                        console.log('writing the last message: ', value);
                        await this.writeMessage(value);
                        this.allMessagesProcessed = true;
                    }
                    if (this.stoppingPoint !== this.endNode){ // there are other nodes at the end
                        console.log('more nodes at end: ', this.stoppingPoint);
                        this.pauseAndResumeWhenReady(pause);
                    }
                    else { // it has reached the end
                        console.log('reached last node: ', this.stoppingPoint);
                        this.end(); // this breaks out of run, and logs a message when all in the group have ended
                    }
                }
                else { // if it has NOT reached a stopping point nor the end
                    // console.log(`Does ${Number(this.consumerOffset)} === ${Number(this.endNode.consumerOffset)-1}`)
                    await this.writeMessage(value);
                }
            }
        });

        // the purpose of this is to ensure the consumer reads from only one partition
        // this is not natively supported by KafkaJS
        // so what I had to do was make a new consumer group for every customer and have it read from the end (not beginning) of the topic
        // then seek moves the reading position for the relevant topic back to zero
        // TODO: 0 might not necessarily be the earlieset offset
        this.consumer.seek({ 
            topic: this.oldTopic.name, partition: this.oldPartitionNum, offset: 0
        })
    }
}

module.exports = {
    TopicRepartitioner,
    RepartitionerGroup,
    RepartitionerAgent
}