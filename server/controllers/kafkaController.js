const { Kafka } = require('kafkajs');
const kafkaController = {};

kafkaController.connect = async (req, res, next) => {
  try {
    const { brokers } = req.body;
    // this should be an array of brokers, like: 
    // ['localhost:9092', 'localhost:9094', 'localhost:9096']

    const kafka = new Kafka({
        clientId: 'my-admin',
        brokers
    });

    const admin = kafka.admin(); 

    console.log('connecting admin to Kafka cluster...')
    await admin.connect();
    console.log('successfully connected admin to Kafka cluster!')
    res.locals.admin = admin;
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
        const admin = res.locals.admin;

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

kafkaController.getTopicsInfo = async (req, res, next) => {
    try {
        const admin = res.locals.admin;


        const { topics } = req.body;
        if (!topics) topics = res.locals.topics;

        // * @DIARY
        // * we wondered whether to get data for just one topic or all of them
        // * i guess it depends if we want to fetch topic data one at a time
        // * (as they hover over the dropdown)
        // * or we fetch all the data in one go (topicS)
        // * we are going with the latter because requests seem more expensive
        // * edit: nvm
        // * the topicsmetadata is such a disgustingly nested object
        // * it would be too hard for the front-end to index into it to get stuff
        

        console.log('fetching topic info...');
        const metaData = await admin.fetchTopicMetadata({ topics });
        console.log(`Here's your metadata: ${metadata}`);
        res.locals.topicsInfo = metadata;
        return next();
    }
    catch (err) {
        return next({
            log: `Error in kafkaController.getTopicInfo: ${err}`,
            status: 400,
            message: { err: 'An error occured' }
        })
    }
}

kafkaController.createTopic = async (req, res, next) => {
    try {
        const admin = res.locals.admin;

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
        const admin = res.locals.admin;
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