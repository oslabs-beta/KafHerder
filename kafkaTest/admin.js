const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-admin',
    brokers: ['localhost:9092', 'localhost:9094', 'localhost:9096']
})

const admin = kafka.admin(); 

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        timeout: 5000,
        topics: [
            {
                topic: 'animals2',
                numParititons: 3,
                replicationFactor: 3,
            }
        ]
    });
    // await console.log(admin.listTopics());
    // await admin.disconnect();
}

run();