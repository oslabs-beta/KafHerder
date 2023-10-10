class TopicRepartitioner {
    constructor (props) {
        this.props = props; // consists of a seedBrokerUrl <String>, oldTopic <Topic>, newTopicName <String>
        this.groups = [];
        this.hasFinished = false;
    }
    run(){
        // run everything
        if (this.hasFinished){
            // return final result
        }
    }
    checkIfFinished(){
        for (const group of this.groups){
            if (!group.hasFinished) return false;
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
    }
    addAgent(props, rpGroup, oldPartitionNum, newPartitionNum, id){

    }
    startAll(){

    }
    allPaused(){
        for (const agent of this.agents){
            if (!agent.isPaused) return false;
        }
        return true; // resumeAll() will be called on agent level for clarity
    }
    resumeAll(){
        for (const agent of this.agents){
            if (this.resume) this.resume();
        }
    }
    checkIfFinished(){
        for (const agent of this.agents){
            if (!agent.hasFinished) return false;
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
        this.oldPartitionNum = oldPartitionNum;
        this.newPartitionNum = newPartitionNum;
        this.id = id;

        this.hasStarted = false;
        this.stoppingPoint = this.oldTopic.partitions[oldPartitionNum].consumerOffsetLL.head; // consumerOffsetNode
        // TODO: add logic if the above is ever null, or the stoppingPoint.consumerGroupId === __end;
        this.isPaused; // should the below be defined later?
        this.hasFinished = false;
        this.producer;
        this.producerOffset;
        this.consumer;
        this.consumerOffset;
        this.resume;
    }
    async createProducer(){
        const kafka = new Kafka({
            clientId: 'producer-'+id,
            brokers: [this.seedBrokerUrl]
        })
        this.producer = kafka.producer({
            allowAutoTopicCreation: false,
            transactionTimeout: 300000
        });
        await producer.connect();
    }
    async createConsumer(){
        const kafka = new Kafka({
            clientId: 'consumer-'+id,
            brokers: [this.seedBrokerUrl]
        })
        this.consumer = kafka.consumer({
            groupId: 'repartitioning'
        });
        await this.consumer.connect();
        await this.consumer.subscribe({ topics: [this.oldTopic.name], fromBeginning: true });
        // consumer.assign() necessary to assign it to a specific partition
        await this.consumer.assign([{ topic: this.oldTopic.name, partition: this.oldPartitionNum }])
    }
    async start(){
        await this.createProducer();
        await this.createConsumer();
        
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

                // consumer logic - extracting message from old partition
                const key = message.key.toString();
                const value = message.value.toString();
                this.consumerOffset = message.offset;

                // pausing and resuming logic
                if (this.consumerOffset === this.stoppingPoint.offset){ // reached the stopping point

                    if (this.stoppingPoint.consumerGroupId === '__end'){ // the stopping point is the end
                        this.hasFinished === true;
                    }
                    else { // the stopping point is NOT the end
                        this.resume = pause(); // pause() returns a resuming function
                        this.isPaused = true;

                        // TODO: this logic is if this is the last agent to pause in the group
                        // in which case, we can resume all
                        // but we should also record the new consumer group offset in the new partition for future reference
                        // right now I just console.log... figure out a better approach here
                        // preferably writing into an object that KafkaJS can later on accept to set new offsets
                        if (this.rpGroup.allPaused()){
                            this.stoppingPoint = this.stoppingPoint.next;
                            console.log(`On partition ${this.newPartitionNum}, consumer group ${this.stoppingPoint.consumerGroupId}'s new offset will be ${this.producerOffset}`)
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
                        { key, value, partition: this.newPartitionNum }
                    ],
                });
                this.producerOffset = result.lastOffset;

                // ending logic
                if (this.hasFinished) this.end();
                // edge case: what if all three consumer groups are at the end?
                // I think this is handled, because if they have reached the end
                // they will NOT pause, they will change to hasFinished = true
                // and therefore all initiate the finishing sequences
            }
        })
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