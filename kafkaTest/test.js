const { Kafka } = require('kafkajs');
const { Topic, Partition, ConsumerOffsetLL, ConsumerOffsetNode } = require('../server/variables/Topic.js');
const { TopicRepartitioner, RepartitionerGroup, RepartitionerAgent } = require('../server/variables/Repartitioner.js');
const repartition = require('./admin.js');

const kafka = new Kafka({
    clientId: 'testing',
    brokers: ['localhost:9092']
});

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

const deleteAllConsumerGroups = async () => {
    try {
        // await connectAdmin();
        const groupIds = await listConsumerGroupIds();
        await admin.deleteGroups(groupIds);
        console.log('All consumer groups deleted successfully');
        // await disconnectAdmin();
    }
    catch (error) {
        console.error('Error deleting groups: ', error)
    }
};

const createTestConsumers = async (topic) => {
    const consumerA = kafka.consumer({ groupId: 'A' });
    const consumerB = kafka.consumer({ groupId: 'B' });
    const consumerC = kafka.consumer({ groupId: 'C' });

    try {
        await consumerA.connect();
        await consumerA.subscribe({ topics: [topic] });
        await consumerB.connect();
        await consumerB.subscribe({ topics: [topic] });
        await consumerC.connect();
        await consumerC.subscribe({ topics: [topic] });
        await consumerA.disconnect();
        await consumerB.disconnect();
        await consumerC.disconnect();
        console.log('successfully subscribed 3 consumer groups');
    }
    catch (error) {
        console.error(error);
    }
}

const setTestOffsets = async (topic) => {
    try {
        // await connectAdmin();
        await admin.setOffsets({
            groupId: 'A',
            topic,
            partitions: [
                { partition: 0, offset: '20'},
                { partition: 1, offset: '30'},
                { partition: 2, offset: '40'},
                { partition: 3, offset: '50'},
                { partition: 4, offset: '60'},
            ]
        });
        await admin.setOffsets({
            groupId: 'B',
            topic,
            partitions: [
                { partition: 0, offset: '30'},
                { partition: 1, offset: '40'},
                { partition: 2, offset: '50'},
                { partition: 3, offset: '20'},
                { partition: 4, offset: '70'},
            ]
        });
        await admin.setOffsets({
            groupId: 'C',
            topic,
            partitions: [
                { partition: 0, offset: '40'},
                { partition: 1, offset: '50'},
                { partition: 2, offset: '60'},
                { partition: 3, offset: '70'},
                { partition: 4, offset: '20'},
            ]
        });
        // await disconnectAdmin();
    } catch (error) {
        console.error(error);
    }
}

// TODO: add delete topic, create new topic, run producers as well
const retest = async (topic) => {
    // wait at least 20 seconds after ending the repartitioning before resuming this
    try {
        await connectAdmin();
        await deleteAllConsumerGroups();
        await createTestConsumers(topic);
        await setTestOffsets(topic);
        await disconnectAdmin();
        // await repartition('animals2', `animals_test1${Math.floor(100000*Math.random())}`);
    }
    catch (error) { console.error(error) }
}


retest('animals2');