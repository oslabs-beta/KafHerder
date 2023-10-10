// you might need to export everything

export class TopicRepartitioner {
    constructor (props) {
        this.props = props; // consists of a seedBrokerUrl <String>, oldTopic <Topic>, newTopicName <String>
    }
}

export class RepartitionerGroup {
    constructor (props, consumerOffsetConfig){
        this.props = props;
        this.consumerOffsetConfig = consumerOffsetConfig;
        this.agents = [];
    }
    addAgent(props, rpGroup, oldPartitionNum, newPartitionNum, id){

    }
    startAll(){

    }
    allPaused(){
        for (const agent of this.agents){
            if (agent.isPaused === false) return false;
        }
        return true;
    }
    resumeAll(){

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
// make sure it records its offset position so the future consumer knows where to pick off from
export class RepartitionerAgent {
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
        this.isPaused; // should the below be defined later?
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
        // .assign() necessary to assign it to a specific partition
        await this.consumer.assign([{ topic: this.oldTopic.name, partition: this.oldPartitionNum }])
    }
    async start(){
        await this.createProducer();
        await this.createConsumer();
        
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                const key = message.key.toString();
                const value = message.value.toString();
                this.consumerOffset = message.offset;

                if (this.consumerOffset === this.stoppingPoint.offset){
                    this.resume = pause(); // no await needed?
                    this.isPaused = true;
                    this.stoppingPoint = this.stoppingPoint.next; // TODO: if null?

                    if (this.rpGroup.allPaused()){
                        // TODO: this means this Partition is the last one to pause
                        // that means you can write the PRODUCER's offset on the partition
                        // plus this.stoppingPoint.consumerGroupName as the NEW offset for the new partition
                        // make sure the stoppingPoint.next is called below this, not above
                        // and figure out how to get the producer's current offset
                        this.rpGroup.resumeAll();
                    }
                }

                // producer logic
                const result = await this.producer.send({ 
                    topic: this.newTopicName,
                    messages: [
                        { key, value, partition: this.newPartitionNum }
                    ],
                });
                this.producerOffset = result.lastOffset;

            }
        })
    }
}