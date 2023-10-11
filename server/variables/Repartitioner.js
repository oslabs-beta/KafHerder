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
    checkIfFinished(){
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

        this.rpGroup = rpGroup; // required to access checkIfAllPaused and unpauseAll methods
        this.oldPartitionNum = Number(oldPartitionNum); // TODO: WHY IS THIS A STRING???
        this.newPartitionNum = newPartitionNum; // this ISN'T a string
        this.id = id;

        this.hasStarted = false;
        this.stoppingPoint = this.oldTopic.partitions[oldPartitionNum].consumerOffsetLL.head; // consumerOffsetNode
        // TODO: add logic if the above is ever null, or the stoppingPoint.consumerGroupId === __end;
        this.isPaused = false; // should the below be defined later?
        this.hasFinished = false;
        this.producer;
        this.consumer;
        this.consumerOffset;
        this.resume;
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
        // this will be explained more in consumer.seek() below
        this.consumer = kafka.consumer({
            groupId: clientIdConsumer,
        });
        await this.consumer.connect();

        // for consumer.subscribe(), do NOT use fromBeginning: true
        // we are deliberately setting the offsets for this consumer group for every partition to the end
        // then, we are going to change the offset of just the desired partition to 0 in consumer.seek() below
        await this.consumer.subscribe({ topics: [this.oldTopic.name] }); // fromBeginning: true

        // hopefully KafkaJS eventually comes out with a simple partition assigner function like below:
        // await this.consumer.assign([{ topic: this.oldTopic.name, partition: this.oldPartitionNum }])
    }
    async start(){
        console.log('creating producer...');
        await this.createProducer();
        console.log('creating consumer...');
        await this.createConsumer();
        
        console.log('reading messages...');
        this.consumer.run({ // this is NOT await according to the requirements of consumer.seek() below
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

                // consumer logic - extracting message from old partition
                
                // const key = message.key.toString(); // this can be null and toString will cause issues
                const value = message.value.toString();
                this.consumerOffset = message.offset;

                console.log({ moving: `${this.oldPartitionNum}->${this.newPartitionNum}`, value, consumerOffset: this.consumerOffset })

                // pausing and resuming logic
                // TODO: delete this if block. the __end logic should handle finishing
                // this if block should also wrap everything including the producer, it runs for one more message currently
                if (this.stoppingPoint === null){ // the stopping point is the end
                    console.log('finished!')
                    this.hasFinished = true;
                }
                else if (this.consumerOffset === this.stoppingPoint.offset){ // reached the stopping point
                    console.log('reached stopping point');

                    // TODO: change from null to '__end'
                    if (this.stoppingPoint === '__end'){ // the stopping point is the end
                        console.log('finished!')
                        this.hasFinished = true;
                    }
                    else { // the stopping point is NOT the end
                        console.log('pausing...')
                        this.resume = pause(); // pause() returns a resuming function
                        this.isPaused = true;

                        // TODO: this logic is if this is the last agent to pause in the group
                        // in which case, we can resume all
                        // but we should also record the new consumer group offset in the new partition for future reference
                        // right now I just console.log... figure out a better approach here
                        // preferably writing into an object that KafkaJS can later on accept to set new offsets
                        if (this.rpGroup.allPaused()){
                            // TODO you probably also need a similar thing for allFinished()
                            console.log(`On partition ${this.newPartitionNum}, consumer group ${this.stoppingPoint.consumerGroupId}'s new offset will be ${this.rpGroup.producerOffset}`)
                            this.stoppingPoint = this.stoppingPoint.next;
                            this.rpGroup.resumeAll();
                        } else {
                            // if they are not all paused, remain paused but move the stopping point
                            this.stoppingPoint = this.stoppingPoint.next; // not very DRY
                        }
                    }
                }
                
                // producer logic - writing message to new partition
                const result = await this.producer.send({ 
                    topic: this.newTopicName,
                    messages: [
                        { value, partition: this.newPartitionNum } // key excluded
                    ],
                });
                this.rpGroup.producerOffset++;
                // this will only work if it is first defined in the rpGroup


                // ending logic
                if (this.hasFinished) this.end();
                // edge case: what if all three consumer groups are at the end?
                // I think this is handled, because if they have reached the end
                // they will NOT pause, they will change to hasFinished = true
                // and therefore all initiate the finishing sequences
            }
        })
        console.log('did it reach the seek?')
        this.consumer.seek({ 
            topic: this.oldTopic.name, partition: this.oldPartitionNum, offset: 0
        })
        // TODO: NOTE: the offset might not necessarily start at 0. if they read 10,000 messages but after 7 days it starts deleting old messages
        // perhaps the earliest offset is actually 1,000
        // it seems though that 0 can still work
        // TODO: note on above: we have now in the Topic something called partitionEnds that have a low and high for each partition
        
        // SEEK is how we set the consumer to only read from a single partition
        // recap:
        // 1. make a new consumer group for every consumer
        // 2. make that consumer/group read from the end of every partition
        // 3. do consumer.run without async
        // 4. use consumer.seek to set the offset for the desired partition to 0
        // we need step 1 to ensure no reassignments if we add more consumers to the same group
    }
    async end(){
        await this.consumer.disconnect();
        await this.producer.disconnect();
        this.rpGroup.checkIfFinished();
    }
}

module.exports = {
    TopicRepartitioner,
    RepartitionerGroup,
    RepartitionerAgent
}