const { Kafka } = require('kafkajs');
const { Topic, Partition, ConsumerOffsetLL, ConsumerOffsetNode } = require('../server/variables/Topic.js');
const { TopicRepartitioner, RepartitionerGroup, RepartitionerAgent } = require('../server/variables/Repartitioner.js');

const kafka = new Kafka({
    clientId: 'my-admin',
    brokers: ['localhost:9092']
})

const admin = kafka.admin();

const connectAdmin = async () => {
    try {
        console.log('connecting to Kafka cluster...')
        await admin.connect();
        console.log('successfully connected!')
    }
    catch (error) { console.error(error) };
}

const disconnectAdmin = async () => {
    try {
        console.log('disconnecting...')
        await admin.disconnect();
        console.log('disconnected!')
    }
    catch (error) { console.error(error) };
}

const createTopic = async (topic, numPartitions, replicationFactor) => {
    try {
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
    }
    catch (error) {
        console.log('failed to connect or create topic');
        console.error(error);
    }
}

const getTopicInfo = async() => {
    try {
        console.log('fetching list of topics....');
        const topics = await admin.listTopics();
        console.log('here are the topics: ', topics);

        console.log('now fetching topicsMetadata...');
        const topicsMetadata = await admin.fetchTopicMetadata({ topics: ['animals2'] });
        console.log('here is the topicsMetadata: ', topicsMetadata);
        for (const topic of topicsMetadata.topics){
            if (!topic.name.includes('offset')){
                console.log(topic);
            }
        }
    }
    catch (error) {
        console.log('failed to fetch topics list or metadata');
        console.error(error);
    }
}


const listConsumerGroupIds = async() => {
    try {
        console.log('fetching list of topics....');
        const response = await admin.listGroups();

        const consumerGroups = [];
        for (group of response.groups){
            if (group.protocolType === 'consumer'){
                consumerGroups.push(group.groupId);
            }
        };
        console.log('here are the consumer groups: ', consumerGroups);
        return consumerGroups;
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}

const fetchOffsets = async( groupId, topicName ) => {
    try {
        console.log(`fetching ${groupId}'s offsets...`);
        const response = await admin.fetchOffsets({ groupId, topics: [topicName]});
        const partitionsArr = response[0].partitions;
        // console.log(partitionsArr);
        // console.log(response);

        // @example:
        // [
        //     { partition: 4, offset: '377', metadata: null },
        //     { partition: 3, offset: '378', metadata: null },
        //     { partition: 0, offset: '378', metadata: null },
        //     { partition: 2, offset: '379', metadata: null },
        //     { partition: 1, offset: '378', metadata: null }
        //   ]
        return partitionsArr;
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}

const getTopicConfigs = async (topicName) => {
    try {
        const partitionEnds = await admin.fetchTopicOffsets(topicName);
        console.log(partitionEnds);
        const topic = new Topic(topicName, partitionEnds);


        const consumerGroupIds = await listConsumerGroupIds();
        // [ 'consumerGroupId1', 'consumerGroupId2', ... ]
        // not all of these have read the topic
        // if they haven't, all their offsets below will be -1

        for (const groupId of consumerGroupIds){

            const partitionObjArr = await fetchOffsets ( groupId, topicName );
            // [
            //     { partition: 0, offset: '377', metadata: null },
            //     { partition: 1, offset: '-1', metadata: null }
            // ]

            for (const partitionObj of partitionObjArr){
                const { partition, offset } = partitionObj;
                if (offset !== '-1'){
                    topic.addConsumerOffset(partition, offset, groupId);
                }
            }
        }
        // console.log('topic: ', topic);
        // console.log('topic.partitions');
        // console.log(topic.partitions[0].consumerOffsetLL.head);
        topic.getAllConsumerOffsetConfigs();
        console.log(topic.numConfigs);
        return topic;
    }
    catch (err) {console.log(err)}
}

const getClusterInfo = async() => {
    try {
        console.log('fetching cluster info....');
        const cluster = await admin.describeCluster();
        console.log('here is the cluster info: ', cluster);
    }
    catch (error) {
        console.log('failed to fetch cluster info');
        console.error(error);
    }
}

// const run = async () => {
//     await createTopic('animals2', 3, 3);
//     await getTopicInfo();
// }

const deleteAllConsumerGroups = async () => {
    try {
        await connectAdmin();
        const groupIds = await listConsumerGroupIds();
        await admin.deleteGroups(groupIds);
        console.log('All consumer groups deleted successfully');
        await disconnectAdmin();
    }
    catch (error) {
        console.error('Error deleting groups: ', error)
    }
};

const repartition = async (oldTopicName, newTopicName) => {
    try {
        await connectAdmin();
        const oldTopic = await getTopicConfigs(oldTopicName);
        const minPartitions = oldTopic.numConfigs;
        const newTopic = await createTopic(newTopicName, minPartitions, 3);

        const topicRepartitioner = new TopicRepartitioner({ seedBrokerUrl: 'localhost:9092', oldTopic, newTopicName  }); // seedBrokerUrl <String>, oldTopic <Topic>, newTopicName <String></String>
        await topicRepartitioner.run();

        await disconnectAdmin();
    }
    catch (error) {
        console.error(error);
    }
}


// repartition('animals2', `animals_test1${Math.floor(100000*Math.random())}`);
// deleteAllConsumerGroups(); // MAKE SURE YOU ARE DISCONNECTED!!!





//createTopic('animals2', 5, 3);
// run(); // THIS CREATES A TOPIC AND GETS TOPIC INFO
// createTopic('animals2', 3, 3)
// getTopicInfo();
// getClusterInfo()
// const response = listConsumerGroupIds();
// returns { groups: [ { groupId: 'consumer-group', protocolType: 'consumer' } ] }
// fetchOffsets( 'consumer-group2', 'animals2'); // try this
getTopicConfigs('animals2');


//



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

module.exports = { repartition, createTopic };