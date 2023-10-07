const { Kafka } = require('kafkajs');
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
  try {
    const { seedBrokerUrl } = req.body;

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
        message: { err: 'An error occured' }
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
    try {
        const admin = res.locals.connectedAdmin;

        const clusterInfo = await admin.describeCluster();

        res.locals.clusterInfo = clusterInfo;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.getClusterInfo: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
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
    try {
        const admin = res.locals.connectedAdmin;

        const topics = await admin.listTopics();

        res.locals.clusterInfo.topics = topics;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.getTopics: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
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
    try {
        const admin = res.locals.connectedAdmin;

        const { topicName } = req.body;

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
            message: { err: 'An error occured' }
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
 * @param {String} req.body.topicName specifies the name of the new topic
 * @param {Number} req.body.numPartitions specifies the number of partitions for the new topic
 * @param {Number} req.body.topicName specifies the replication factor for the new topic
 * @returns {Boolean} res.locals.wasCreated will be false if the topic already exists
 */
adminController.createTopic = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        const { topicName, numPartitions, replicationFactor } = req.body;

        const wasCreated = await admin.createTopics({
            validateOnly: false, // default
            waitForLeaders: true, // default
            timeout: 5000, // default
            topics: [
                {
                    topic: topicName,
                    numPartitions,
                    replicationFactor,
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
            message: { err: 'An error occured' }
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
    try {
        const admin = res.locals.connectedAdmin;
        await admin.disconnect();
        console.log('Disconnected admin from Kafka cluster.');
        return next();
    }
    catch (err) {
        return next({
            log: `Error in adminController.disconnect: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
};

module.exports = adminController;