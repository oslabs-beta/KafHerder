const { Kafka } = require('kafkajs');
const { Topic, Partition, ConsumerOffsetLL, ConsumerOffsetNode } = require('../variables/Topic.js');
const { TopicRepartitioner, RepartitionerGroup, RepartitionerAgent } = require('../variables/Repartitioner.js');

const adminController = {};

/**
 * Connects to a Kafka cluster via KafkaJS admin. Should be the first middleware in any route that uses KafkaJS admin
 * Only requires one seed broker. KafkaJS will discover the rest.
 * 
 * @async
 * @function
 * @param {String} req.body.seedBrokerUrl should be the url of the port (ex. 'localhost:9092') of one Kafka broker in the cluster
 * @returns {Object} res.locals.connectedAdmin will be a KafkaJS admin client connected to a Kafka cluster
 * // [ 'animals2', 'animals', '__consumer_offsets' ]
 */
adminController.connectAdmin = async (req, res, next) => {
  const { seedBrokerUrl } = req.body;

  try {
    const kafka = new Kafka({
        clientId: 'my-admin',
        brokers: [ seedBrokerUrl ]
    });
    
    const admin = kafka.admin(); 
    await admin.connect();
    console.log('Connected admin to Kafka cluster.');

        res.locals.connectedAdmin = admin;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.verifyPort: ${err}`,
            status: 400,
            message: { err: 'An error occured in adminController.connectAdmin' }
        })
    }
};

// @TODO: route should be connect ---> getClusterInfo ---> getTopics and ADD it to the ClusterInfo

/**
 * Retrieves cluster information from a Kafka cluster.
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 * @returns {Object} res.locals.clusterInfo will have the following shape:
 * // {
 * //  brokers: [
 * //    { nodeId: 2, host: 'localhost', port: 9094 },
 * //    { nodeId: 3, host: 'localhost', port: 9096 },
 * //    { nodeId: 1, host: 'localhost', port: 9092 }
 * //  ],
 * //  controller: 2,
 * //  clusterId: 'gp0aetvsQrK28GH_ZMTI5Q',
 * //  // later on, topics: [array, of, topic, names]
 * // }
 */
adminController.getClusterInfo = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;

    try {
        const clusterInfo = await admin.describeCluster();

        res.locals.clusterInfo = clusterInfo;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.getClusterInfo: ${err}`,
            status: 400,
            message: { err: 'An error occured in adminController.getClusterInfo' }
        })
    }
}

/**
 * Retrieves a list of topics from a Kafka cluster.
 * NOTE: this middleware should come AFTER getClusterInfo
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 * @param {Object} res.locals.clusterInfo is passed from the previous middleware
 * @returns {Array} res.locals.clusterInfo.topics will have the following shape:
 * // [ 'animals2', 'animals', '__consumer_offsets' ]
 */
adminController.getTopics = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;

    try {
        const topics = await admin.listTopics();

        res.locals.clusterInfo.topics = topics;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.getTopics: ${err}`,
            status: 400,
            message: { err: 'An error occured in getTopics' }
        })
    }
}

/**
 * Retrieves partition information for a given Kafka topic.
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 * @param {String} req.body.topicName specifies the desired topic to retrieve partition info about 
 * @returns {Array} res.locals.partitionInfo will have the following shape:
 * // [
 * //     {
 * //       partitionErrorCode: 0,
 * //       partitionId: 0,
 * //       leader: 3,
 * //       replicas: [Array],
 * //       isr: [Array],
 * //       offlineReplicas: []
 * //     },
 * //     ...
 * // ]
 */
adminController.getPartitions = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;
    const { topicName } = req.body;

    try {

        const metadata = await admin.fetchTopicMetadata({ topics: [topicName] });
        // * metadata structure: Metadata:  { topics: [ { name: topicName, partitions: [Array] } ] }

        const topicsArr = metadata.topics;
        const partitions = topicsArr[0].partitions;
        res.locals.partitions = partitions;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.getPartitions: ${err}`,
            status: 400,
            message: { err: 'An error occured in getPartitions' }
        })
    }
}

// @TODO: stretch feature would be allowing user to provide additional configurations
/**
 * Creates a topic in the Kafka cluster given provided information.
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 * @param {String} req.body.newTopicName specifies the name of the new topic
 * @param {Number} req.body.newMinPartitionNumber specifies the number of partitions for the new topic
 * @param {Number} req.body.newReplicationFactorNumber specifies the replication factor for the new topic
 * @returns {Boolean} res.locals.wasCreated will be false if the topic already exists
 */
adminController.createTopic = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;
    const { newTopicName, newMinPartitionNumber, newReplicationFactorNumber } = req.body;

    try {
        const wasCreated = await admin.createTopics({
            validateOnly: false, // default
            waitForLeaders: true, // default
            timeout: 5000, // default
            topics: [
                {
                    topic: newTopicName,
                    numPartitions: newMinPartitionNumber,
                    replicationFactor: newReplicationFactorNumber,
                    replicaAssignment: [], // default
                    configEntries: [] // default
                }
            ]
        });

        res.locals.wasCreated = wasCreated;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.createTopic: ${err}`,
            status: 400,
            message: { err: 'An error occuredin createTopic' }
        })
    }
}

/**
 * Disconnects a KafkaJS admin client from a Kafka cluster. Should be the last middleware in any route that uses KafkaJS admin
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 */
adminController.disconnectAdmin = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;
    try {
        await admin.disconnect();
        console.log('Disconnected admin from Kafka cluster.');
        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.disconnect: ${err}`,
            status: 400,
            message: { err: 'An error occured in disconnect' }
        })
    }
};


// ~~~ getMinPartitions route: ~~~

// MIDDLEWARE 1
// takes in a connected admin
// returns list of consumerGroupIds: [ 'consumerGroupId1', 'consumerGroupId2', ... ]
adminController.fetchConsumerGroupIds = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;

    try {
        const response = await admin.listGroups();

        const consumerGroupIds = [];
        for (group of response.groups){
            if (group.protocolType === 'consumer'){
                consumerGroupIds.push(group.groupId);
            }
        };

        res.locals.consumerGroupIds = consumerGroupIds;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.fetchConsumerGroupIds: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

// MIDDLEWARE 2
// this is to know what the offset of the last message is
// we need this for our Topic object to put __end nodes so we can stop
//
// returns an array of highs and lows of offsets for each partition
// the high is where new messages are being produced to
// the offset is the consumer offset of the furthest consumer
// TODO: the difference between high - offset is actually the consumer lag!
// [
//  { partition: 0, offset: '378', high: '378', low: '0' },
//  { partition: 1, offset: '379', high: '379', low: '0' },
// ]
adminController.fetchPartitionEnds = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;
    const { topicName } = req.body;

    try {
        const response = await admin.fetchTopicOffsets(topicName);
        res.locals.partitionEnds = response;
        return next();
    }
    catch (error) {
        console.log('failed to fetch partition ends');
        console.error(error);
    }
}

// MIDDLEWARE 3
// takes in the consumerGroupIds/partitionEnds from the previous middleware, as well as the connected admin
// also takes the old topic name passed initially in the body
// returns a Topic object with all the offset information you could possibly need
// see Topic.js for more information about its shape
// YOU CAN ACCESS THE NUMBER OF CONFIGS IN THE RESPONSE:
// topicObj.numConfigs
adminController.calculateTopicConfigs = async (req, res, next) => {
    const admin = res.locals.connectedAdmin;
    const consumerGroupIds = res.locals.consumerGroupIds;
    const partitionEnds = res.locals.partitionEnds;
    const { topicName } = req.body;
    const topic = new Topic(topicName, partitionEnds);

    // HELPER FUNCTION: fetches offsets on each partition of the topic for one consumerGroup
    // TODO: JSDocs for this function
    const fetchOffsets = async (groupId, topicName) => {
        try {
            const response = await admin.fetchOffsets({ groupId, topics: [topicName]});
            const partitionObjArr = response[0].partitions;
            // @example:
            // [
            //     { partition: 0, offset: '377', metadata: null },
            //     { partition: 1, offset: '-1', metadata: null }
            // ]
            // if the consumer group has NOT read a partition, the offset will be '-1'
            return partitionObjArr;
        }
        catch (err) {
            return next({
                log: `Failed to fetch ${groupId}'s offsets in adminController.calculateTopicConfigs: ${err}`,
                status: 400,
                message: { err: 'An error occured' }
            })
        }
    }

    try {
        for (const groupId of consumerGroupIds){

            const partitionObjArr = await fetchOffsets ( groupId, topicName );

            for (const partitionObj of partitionObjArr){
                const { partition, offset } = partitionObj;
                if (offset !== '-1'){
                    // this is where we build out the topic object:
                    topic.addConsumerOffset(partition, offset, groupId);
                }
            }
        }
        topic.getAllConsumerOffsetConfigs(); // TODO: maybe this should happen automatically?
        
        res.locals.topicObj = topic;
        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.calculateTopicConfigs: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

// @returns newConsumerOffsets:
    // { 'A': {
    //          groupId: 'A',
    //          topic,
    //          partitions: [
    //                          { partition: 0, offset: '20'},
    //                          { partition: 1, offset: '30'},
    //                          { partition: 2, offset: '40'},
    //                       ]
    //         },
    //    'B': ...
    // }
adminController.repartition = async (req, res, next) => {
    const { seedBrokerUrl, newTopicName } = req.body;
    const oldTopic = res.locals.topicObj;
    const topicRepartitioner = new TopicRepartitioner({ seedBrokerUrl, oldTopic, newTopicName  });

    try{
        res.locals.newConsumerOffsets = await topicRepartitioner.run();
        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.repartition: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

module.exports = adminController;