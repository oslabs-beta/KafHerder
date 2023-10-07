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