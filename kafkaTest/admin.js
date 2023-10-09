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
        console.log('here are the topics: ', topics);

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


const listConsumerGroupIds = async() => {
    try {
        console.log('connecting to Kafka cluster...');
        await admin.connect();
        console.log('successfully connected!');

        console.log('fetching list of topics....');
        const response = await admin.listGroups();

        const consumerGroups = [];
        for (group of response.groups){
            if (group.protocolType === 'consumer'){
                consumerGroups.push(group.groupId);
            }
        };
        console.log('here are the consumer groups: ', consumerGroups);

        console.log('disconnecting...');
        await admin.disconnect();
        return consumerGroups;
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}

class Topic {
    constructor (topicName){
        this.topicName = topicName;
        this.partitions = {}; // would a map be better?
        this.consumerOffsetConfigurations = new Map();
    }

    addConsumerGroupOffset(partitionNumber, offset, consumerGroupName){
        if (!this.partitions[partitionNumber]){
            this.partitions[partitionNumber] = new Partition(partitionNumber);
        }
        this.partitions[partitionNumber].consumerOffsetLL.add(offset, consumerGroupName);
    }

    calculateConsumerGroupConfigurations(){

    }
}

// actually a string is not the best way


// you want to find the relevant partition of the topic
// and ADD an offset to it
// const topic;
// const consumerGroupName;
// for const partitionObj of partitionsArr:
//  const { partition, offset } = partitionObj;
//  Topic.addConsumerGroupOffset(partition, offset, consumerGroupName);

//  const partitionNumber = partitionObj.partition
//  const offset = partitionObj.offset
// animals.partitions[partitionNumber].consumerOffsetLL.add(offset, consumerGroupName)


class Partition {
    constructor (partitionNumber){
        this.partitionNumber = partitionNumber;
        this.consumerOffsetLL = new ConsumerOffsetLL;
    }
}

class ConsumerOffsetLL {
    constructor (){
        this.head = null;
        this.tail = null;
    }

    // Method to add a new node to the linked list in sorted order
    add(offset, consumerGroupName) {
        const newNode = new ConsumerOffsetNode(offset, consumerGroupName);
        const numericOffset = parseInt(offset, 10);
    
        if (this.head === null || 
            parseInt(this.head.offset, 10) > numericOffset || 
            (parseInt(this.head.offset, 10) === numericOffset && this.head.consumerGroupName > consumerGroupName)) {
            newNode.next = this.head;
            this.head = newNode;
            if (this.tail === null) {
                this.tail = newNode;
            }
            return;
        }
    
        let currentNode = this.head;
        while (currentNode.next !== null &&
               (parseInt(currentNode.next.offset, 10) < numericOffset ||
               (parseInt(currentNode.next.offset, 10) === numericOffset && currentNode.next.consumerGroupName < consumerGroupName))) {
            currentNode = currentNode.next;
        }
    
        newNode.next = currentNode.next;
        currentNode.next = newNode;
        if (newNode.next === null) {
            this.tail = newNode;
        }
    }

    // Method to print all nodes in the linked list
    printAll() {
        let output = 'Consumer Offsets: ';
        let currentNode = this.head;
        while (currentNode !== null) {
            output += `[${currentNode.consumerGroupName}: ${currentNode.offset}] -> `;
            currentNode = currentNode.next;
        }
        output += 'null';
        console.log(output);
    }


}

class ConsumerOffsetNode {
    constructor (offset, consumerGroupName){
        this.next = null;
        this.offset = offset; // THIS IS A STRING for consistency with KafkaJS
        this.consumerGroupName = consumerGroupName; // string
    }
}

const fetchOffsets = async( groupId, topicName ) => {
    try {
        console.log('connecting to Kafka cluster...');
        await admin.connect();
        console.log('successfully connected!');

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

        console.log('disconnecting...');
        await admin.disconnect();
        return partitionsArr;
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}


const fetchAllOffsets = async( consumerGroupIds, topicName ) => {
    const allConsumerGroupOffsets = {};
    try {
        console.log('connecting to Kafka cluster...');
        await admin.connect();
        console.log('successfully connected!');

        for (const groupId of consumerGroupIds){
            const response = await admin.fetchOffsets({ groupId, topics: [topicName]});
            const partitionsArr = response[0].partitions;    
            // @example:
            // [
            //     { partition: 4, offset: '377', metadata: null },
            //     { partition: 3, offset: '378', metadata: null },
            //     { partition: 0, offset: '-1', metadata: null },
            //     { partition: 2, offset: '379', metadata: null },
            //     { partition: 1, offset: '-1', metadata: null }
            //   ]
            // this will return ALL partitions, but -1 for the offset if it doesn't exist
            // what I'm realizing then is that it wouldn't be efficient to get all the ConsumerGroupOffsets first

            if (allConsumerGroupOffsets[groupId])


            allOffsets.push(response);
            // this is largely useless. we want consumerGroupId
        }

        console.log(`fetching ${groupId}'s offsets...`);
        const response = await admin.fetchOffsets({ groupId, topics: [topicName]});
        const partitionsArr = response[0].partitions;
        // console.log(partitionsArr);
        console.log(response);

        // @example:
        // [
        //     { partition: 4, offset: '377', metadata: null },
        //     { partition: 3, offset: '378', metadata: null },
        //     { partition: 0, offset: '378', metadata: null },
        //     { partition: 2, offset: '379', metadata: null },
        //     { partition: 1, offset: '378', metadata: null }
        //   ]

        console.log('disconnecting...');
        await admin.disconnect();
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}

const getTopicConfigurations = async (topicName) => {
    const topic = new Topic(topicName);

    try {
        // await admin.connect();
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
                    topic.addConsumerGroupOffset(partition, offset, groupId);
                }
            }
        }
        console.log('topic: ', topic);
        console.log('topic.partitions');
        console.log(topic.partitions[0].consumerOffsetLL.head);
        return topic;
    }
    catch (err) {console.log(err)}
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
// getClusterInfo()
// const response = listConsumerGroupIds();
// returns { groups: [ { groupId: 'consumer-group', protocolType: 'consumer' } ] }
// fetchOffsets( 'consumer-group2', 'animals2'); // try this
getTopicConfigurations('animals2');


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