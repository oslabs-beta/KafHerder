// you might need to export everything

export class TopicRepartitioner {
    constructor (props) {
        this.props = props; // seedBrokerUrl, oldTopic, newTopicName
    }
}

export class RepartitionerGroup {
    constructor (props, consumerOffsetConfig){
        this.props = props; // seedBrokerUrl, oldTopic, newTopicName
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

export class Repartitioner {
    constructor (props, rpGroup, oldPartitionNum, newPartitionNum, id){
        this.props = props; // seedBrokerUrl, oldTopic, newTopicName
        this.rpGroup = rpGroup; // required to access checkIfAllPaused and unpauseAll methods
        this.oldPartitionNum = oldPartitionNum;
        this.newPartitionNum = newPartitionNum;
        this.id = id;

        // 
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