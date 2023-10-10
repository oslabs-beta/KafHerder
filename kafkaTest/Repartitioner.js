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
    checkIfAllPaused(){
        for (const agent of this.agents){
            if (agent.isPaused === false) return false;
        }
        return true;
    }
    unpauseAll(){

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

        this.isPaused;
        this.stoppingPoint;
        this.producer;
        this.consumer;
        this.unpause;
    }
    async createProducer(){
        const kafka = new Kafka({
            clientId: 'producer-'+id,
            brokers: [this.props.seedBrokerUrl]
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
            brokers: [this.props.seedBrokerUrl]
        })
        this.consumer = kafka.consumer({
            groupId: 'repartitioning'
        });
        await this.consumer.connect();
        await this.consumer.subscribe({ topics: this.props.oldTopic.name })
    }
    async initialize(){

    }
}