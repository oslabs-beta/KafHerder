const { Kafka } = require('kafkajs');
const topic = 'animals';

const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'consumer-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
        },
    })
}

run();
