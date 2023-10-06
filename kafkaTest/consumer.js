const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: ['localhost:9092', 'localhost:9094', 'localhost:9096']
})

const consumer = kafka.consumer({ groupId: 'consumer-group' });

const run = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
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

run('animals2');
