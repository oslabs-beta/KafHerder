const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-admin',
    brokers: ['localhost:9092', 'localhost:9094', 'localhost:9096']
})

const admin = kafka.admin(); 

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        timeout: 5000,
        topics: [
            {
                topic: 'animals4',
                numParititons: 3,
                replicationFactor: 3,
            }
        ]
    });
    await admin.disconnect();
}

const run2 = async () => {
    await admin.connect();
    const topics = await admin.listTopics();
    console.log(topics);
    const topicsMetadata = await run3(topics);
    await admin.disconnect();
    return topicsMetadata;
}

const run3 = async (topics) => {
    // await admin.connect();
    const topicsMetadata = await admin.fetchTopicMetadata({ topics });
    console.log(topicsMetadata);

    for (const topic of topicsMetadata.topics){
        if (topic.name.includes('animals')){
            console.log(topic);
            console.log(topic.partitions[0].replicas)
        // for (const partition of topic){
        //     console.log(partition);
        // }
        }
    }
    // topicsMetadata.topics.forEach(info => console.log(`topic ${info.name} has partitions: ${info.partitions[0].partitionId}`));
    // await admin.disconnect();
    return topicsMetadata;
}

// run();
const topicsMetadata = run2();
// run3(topics);