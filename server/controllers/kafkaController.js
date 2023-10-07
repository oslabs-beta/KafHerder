const { Kafka } = require('kafkajs');
const kafkaController = {};

/**
 * Connects to a Kafka cluster via KafkaJS admin. Should be the first middleware in any route that uses KafkaJS admin
 * Only requires one seed broker. KafkaJS will discover the rest.
 * 
 * @async
 * @function
 * @param {String} req.body.seedBroker should be a port number of one Kafka broker in the cluster
 * @returns {Object} res.locals.connectedAdmin will be a KafkaJS admin client connected to a Kafka cluster
 * // [ 'animals2', 'animals', '__consumer_offsets' ]
 */
kafkaController.connectAdmin = async (req, res, next) => {
  try {
    const { seedBroker } = req.body;

    const kafka = new Kafka({
        clientId: 'my-admin',
        brokers: [ seedBroker ]
    });

    const admin = kafka.admin(); 

    console.log('connecting admin to Kafka cluster...')
    await admin.connect();
    console.log('successfully connected admin to Kafka cluster!')
    res.locals.connectedAdmin = admin;
    return next();
  }
  catch (err) {
    return next({
        log: `Error in kafkaController.verifyPort: ${err}`,
        status: 400,
        message: { err: 'An error occured' }
    })
  }
};

/**
 * Retrieves a list of topics from a Kafka cluster.
 * 
 * @async
 * @function
 * @param {Object} res.locals.connectedAdmin should be a KafkaJS admin client connected to a Kafka cluster
 * @returns {Array} res.locals.topics will have the following shape:
 * // [ 'animals2', 'animals', '__consumer_offsets' ]
 */
kafkaController.getTopics = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        console.log('fetching list of topics....');
        const topics = await admin.listTopics();
        console.log('here are the topics: ', topics);

        res.locals.topics = topics;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.getTopics: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

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
 * //  clusterId: 'gp0aetvsQrK28GH_ZMTI5Q'
 * // }
 */
kafkaController.getClusterInfo = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        console.log('Fetching cluster info....');
        const clusterInfo = await admin.describeCluster();
        console.log('Here is the cluster info: ', clusterInfo);

        res.locals.clusterInfo = clusterInfo;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.getClusterInfo: ${err}`,
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
kafkaController.getPartitions = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        const { topicName } = req.body;

        console.log('Fetching topic info...');
        const metadata = await admin.fetchTopicMetadata({ topics: [topicName] });
        // metadata structure: Metadata:  { topics: [ { name: topicName, partitions: [Array] } ] }

        const topicsArr = metadata.topics;
        const partitions = topicsArr[0].partitions;
        res.locals.partitions = partitions;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.getPartitions: ${err}`,
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
kafkaController.createTopic = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        const { topicName, numPartitions, replicationFactor } = req.body;

        console.log(`Creating topic ${topicName} with ${numPartitions} partitions and rep factor ${replicationFactor}`);
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
        console.log(`${wasCreated ? 'Successfully created topic!' : 'Topic already exists'}`);

        res.locals.wasCreated = wasCreated;

        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.createTopic: ${err}`,
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
kafkaController.disconnectAdmin = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;
        await admin.disconnect();
        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.disconnect: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
};