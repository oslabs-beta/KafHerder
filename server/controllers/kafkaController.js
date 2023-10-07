const { Kafka } = require('kafkajs');
const kafkaController = {};

kafkaController.connect = async (req, res, next) => {
  try {
    const { seedBroker } = req.body; // expecting a string

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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
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

        console.log('fetching cluster info....');
        const clusterInfo = await admin.describeCluster();
        console.log('here is the cluster info: ', clusterInfo);

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

        const { topicName } = req.body; //! this will be a string

        console.log('fetching topic info...');
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

kafkaController.createTopic = async (req, res, next) => {
    try {
        const admin = res.locals.connectedAdmin;

        const { topic, numPartitions, replicationFactor } = req.body;
        
        console.log(`Creating topic ...`);
        const 
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.createTopic: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

kafkaController.disconnect = async (req, res, next) => {
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