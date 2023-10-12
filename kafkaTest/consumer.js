const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-consumer-12',
    brokers: ['localhost:9092'] //, 'localhost:9094', 'localhost:9096']
})

const consumer = kafka.consumer({ groupId: '4' });

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

const run2 = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topics: [topic]  }); // fromBeginning: true

    // consumer.on(consumer.events.GROUP_JOIN, (e) => {
    //     console.log(`HELLO? Consumer Member ID: ${e.payload.memberId}`);
    // }); // THIS WORKS! but I think the logic for the partitionAssigner won't work
    // // reason being: you use it AS you are making the consumers
    // // which is very silly... how do you know their memberIds after?

    await consumer.run({
        eachMessage: async ({ topic, partition, message, pause }) => {
            console.log({
                name: 'c1',
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
            if (message.offset === '250') { 
                console.log('pausing');
                pause();
            };;
        },
    })
    consumer.seek({
        topic, partition: 1, offset: 200
    })
    // ONE POSSIBLE WAY AROUND THIS: set the offsets for the entire consumer group to the END of the topic completely
    // HOLY CRAP THIS WORKS
    // this might not prove anything...
    // because if there are two consumers
    // the solution to this? would be making a new consumer group for EVERY consumer
}

const createTestConsumers = async (topic) => {
    const consumerB = kafka.consumer({ groupId: 'B' });
    const consumerC = kafka.consumer({ groupId: 'C' });

    try {
        await consumer.connect();
        await consumer.subscribe({ topics: [topic] });
        await consumerB.connect();
        await consumerB.subscribe({ topics: [topic] });
        await consumerC.connect();
        await consumerC.subscribe({ topics: [topic] });
        await consumer.disconnect();
        await consumerB.disconnect();
        await consumerC.disconnect();
        console.log('successfully subscribed 3 consumer groups');
    }
    catch (error) {
        console.error(error);
    }
}

// run2('animals2');
run('animals2');
// createTestConsumers('animals2');


// HOW TO MAKE A CONSUMER READ FROM A SINGLE PARTITION
// KafkaJS does not natively support consumer.assign(partition) like node's Kafka utility
// You can make a Custom Partition Assigner, but this is stupidly complicated
// The best way I found to do this is as follows:
// Step 1. Make a NEW consumer group for every consumer!
// Step 2. Make that consumer read from the END (NOT the beginning)
// Step 3. Do consumer.run as normal, but WITHOUT async.
// Step 4. Use consumer.seek({ topic, partition, offset: 0 }) for the partition you want (no async)
// The reason you need a new consumer group for every consumer
// Is because with seek you may be resetting the offset for a specific partition
// ACTUALLY... maybe not. Because as soon as you do seek, your consumer is assigned to THAT partition
// And no other consumer can be assigned to it
// So maybe it doesn't matter at all!
// EXAMPLE: in beginning, it might look like:
// consumer1 assigned to [1,2,3,4], seeking it to 1 does nothing
// consumer2 assigned to [3,4] and consumer1 [1,2]
// then you seek it to 2 and it changes to: consumer2 [2,4] consumer1 [1,3]
// but it COULD be consumer2 [1,2] consumer1 [3,4]
// no guarantee it keeps partition 1 to consumer1
// so it might be best to make a new consumer group each time
// Just make sure to delete all the consumer groups at the end