const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-admin',
    brokers: ['localhost:9092'] //, 'localhost:9094', 'localhost:9096']
    // apparently you only need to give one broker and kafkajs will find the rest
})

const admin = kafka.admin(); 

const createTopic = async (topic, numPartitions, replicationFactor) => {
    try {
        console.log('connecting to Kafka cluster...')
        await admin.connect();
        console.log('successfully connected!')

        console.log(`creating topic ${topic} with ${numPartitions} partitions and rep factor ${replicationFactor}`);
        await admin.createTopics({
            validateOnly: false,
            waitForLeaders: true,
            timeout: 5000,
            topics: [
                {
                    topic,
                    numPartitions,
                    replicationFactor
                }
            ]
        });
        console.log('successfully created topic!');

        console.log('disconnecting...');
        await admin.disconnect();
    }
    catch (error) {
        console.log('failed to connect or create topic');
        console.error(error);
    }
}

const getTopicInfo = async() => {
    try {
        console.log('connecting to Kafka cluster...');
        await admin.connect();
        console.log('successfully connected!');

        console.log('fetching list of topics....');
        const topics = await admin.listTopics();
        // console.log('here are the topics: ', topics);

        console.log('now fetching topicsMetadata...');
        const topicsMetadata = await admin.fetchTopicMetadata({ topics: ['animals2'] });
        console.log('here is the topicsMetadata: ', topicsMetadata);
        for (const topic of topicsMetadata.topics){
            if (!topic.name.includes('offset')){
                console.log(topic);
            }
        }

        console.log('disconnecting...');
        await admin.disconnect();
    }
    catch (error) {
        console.log('failed to fetch topics list or metadata');
        console.error(error);
    }
}

const getClusterInfo = async() => {
    try {
        console.log('connecting to Kafka cluster...');
        await admin.connect();
        console.log('successfully connected!');

        console.log('fetching cluster info....');
        const cluster = await admin.describeCluster();
        console.log('here is the cluster info: ', cluster);

        console.log('disconnecting...');
        await admin.disconnect();
    }
    catch (error) {
        console.log('failed to fetch cluster info');
        console.error(error);
    }
}

const run = async () => {
    await createTopic('animals2', 3, 3);
    await getTopicInfo();
}

//createTopic('animals2', 5, 3);
// run(); // THIS CREATES A TOPIC AND GETS TOPIC INFO
// createTopic('animals2', 3, 3)
// getTopicInfo();
getClusterInfo()




// const run2 = async () => {
//     await admin.connect();
//     const topics = await admin.listTopics();
//     console.log(topics);
//     const topicsMetadata = await run3(topics);
//     await admin.disconnect();
//     return topicsMetadata;
// }

// const run3 = async (topics) => {
//     // await admin.connect();
//     const topicsMetadata = await admin.fetchTopicMetadata({ topics });
//     console.log(topicsMetadata);

//     for (const topic of topicsMetadata.topics){
//         if (topic.name.includes('animals')){
//             console.log(topic);
//             console.log(topic.partitions[0].replicas)
//         // for (const partition of topic){
//         //     console.log(partition);
//         // }
//         }
//     }
//     // topicsMetadata.topics.forEach(info => console.log(`topic ${info.name} has partitions: ${info.partitions[0].partitionId}`));
//     // await admin.disconnect();
//     return topicsMetadata;
// }


// run();
// const topicsMetadata = run2();
// run3(topics);