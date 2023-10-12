const { Kafka } = require('kafkajs');
const Chance = require('chance');
const { Topic, Partition, ConsumerOffsetLL, ConsumerOffsetNode } = require('../server/variables/Topic.js');
const { TopicRepartitioner, RepartitionerGroup, RepartitionerAgent } = require('../server/variables/Repartitioner.js');
const { repartition } = require('./admin.js');


const kafka = new Kafka({
    clientId: 'testing',
    brokers: ['localhost:9092']
});
const chance = new Chance();

const admin = kafka.admin();

const connectAdmin = async () => {
    try {
        console.log('connecting to Kafka cluster...')
        await admin.connect();
        console.log('successfully connected!')
    }
    catch (error) { console.error(error) };
}

const disconnectAdmin = async () => {
    try {
        console.log('disconnecting...')
        await admin.disconnect();
        console.log('disconnected!')
    }
    catch (error) { console.error(error) };
}

const createTopic = async (topic, numPartitions, replicationFactor) => {
    try {
        console.log(`creating topic ${topic} with ${numPartitions} partitions and rep factor ${replicationFactor}`);
        await admin.createTopics({
            validateOnly: false,
            waitForLeaders: true,
            timeout: 5000,
            topics: [
                {
                    topic,
                    numPartitions,
                    replicationFactor
                }
            ]
        });
        console.log('successfully created topic!');
    }
    catch (error) {
        console.log('failed to connect or create topic');
        console.error(error);
    }
}

const listConsumerGroupIds = async() => {
    try {
        console.log('fetching list of topics....');
        const response = await admin.listGroups();

        const consumerGroups = [];
        for (group of response.groups){
            if (group.protocolType === 'consumer'){
                consumerGroups.push(group.groupId);
            }
        };
        console.log('here are the consumer groups: ', consumerGroups);
        return consumerGroups;
    }
    catch (error) {
        console.log('failed to consumer groups list');
        console.error(error);
    }
}

const deleteAllConsumerGroups = async () => {
    try {
        // await connectAdmin();
        const groupIds = await listConsumerGroupIds();
        await admin.deleteGroups(groupIds);
        console.log('All consumer groups deleted successfully');
        // await disconnectAdmin();
    }
    catch (error) {
        console.error('Error deleting groups: ', error)
    }
};

const createTestConsumers = async (topic) => {
    const consumerA = kafka.consumer({ groupId: 'A' });
    const consumerB = kafka.consumer({ groupId: 'B' });
    const consumerC = kafka.consumer({ groupId: 'C' });

    try {
        await consumerA.connect();
        await consumerA.subscribe({ topics: [topic] });
        await consumerB.connect();
        await consumerB.subscribe({ topics: [topic] });
        await consumerC.connect();
        await consumerC.subscribe({ topics: [topic] });
        await consumerA.disconnect();
        await consumerB.disconnect();
        await consumerC.disconnect();
        console.log('successfully subscribed 3 consumer groups');
    }
    catch (error) {
        console.error(error);
    }
}

const setTestOffsets = async (topic) => {
    try {
        // await connectAdmin();
        await admin.setOffsets({
            groupId: 'A',
            topic,
            partitions: [
                { partition: 0, offset: '20'},
                { partition: 1, offset: '30'},
                { partition: 2, offset: '40'},
                { partition: 3, offset: '50'},
                { partition: 4, offset: '60'},
            ]
        });
        await admin.setOffsets({
            groupId: 'B',
            topic,
            partitions: [
                { partition: 0, offset: '30'},
                { partition: 1, offset: '40'},
                { partition: 2, offset: '50'},
                { partition: 3, offset: '20'},
                { partition: 4, offset: '70'},
            ]
        });
        await admin.setOffsets({
            groupId: 'C',
            topic,
            partitions: [
                { partition: 0, offset: '40'},
                { partition: 1, offset: '50'},
                { partition: 2, offset: '60'},
                { partition: 3, offset: '70'},
                { partition: 4, offset: '20'},
            ]
        });
        // await disconnectAdmin();
    } catch (error) {
        console.error(error);
    }
}



const sendTestMessages = async (topic, messagesToSend) => {
    const producer = kafka.producer();
    let counter = 0;
    let interval; // Define the interval here

    const produceMessage = async () => {
        if (counter >= messagesToSend) {
            clearInterval(interval); // Accessible here
            console.log('done sending messages!');
            await producer.disconnect();
            return;
        }
        
        console.log('animal sent');
        try {
            await producer.send({
                topic,
                messages: [
                    { value: chance.animal() },
                ],
            });
            counter++;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    try {
        await producer.connect();
        console.log('sending messages...');
        interval = setInterval(produceMessage, 10); // Assign the interval here
    } catch (error) {
        console.error(error);
    }
}

        
// TODO: add delete topic, create new topic, run producers as well
const reset = async (topic) => {
    // wait at least 20 seconds after ending the repartitioning before resuming this
    try {
        await connectAdmin();
        await deleteAllConsumerGroups();
        await createTestConsumers(topic);
        await setTestOffsets(topic);
        await disconnectAdmin();
        // await repartition('animals2', `animals_test1${Math.floor(100000*Math.random())}`);
    }
    catch (error) { console.error(error) }
}

// TODO: add delete topic, create new topic, run producers as well
const hardReset = async (topic, numPartitions, replicationFactor, messagesToSend) => {
    // wait at least 20 seconds after ending the repartitioning before resuming this
    try {
        await connectAdmin();
        await createTopic (topic, numPartitions, replicationFactor);
        await sendTestMessages (topic, messagesToSend);
        await createTestConsumers(topic);
        await setTestOffsets(topic);
        await disconnectAdmin();
    }
    catch (error) { console.error(error) }
}

const runSomething = async () => {
    try {
        await connectAdmin();
        const ids = await listConsumerGroupIds;
        console.log(ids);
        await disconnectAdmin();
    }
    catch (error) {console.error(error)}
}

runSomething();

module.exports = { reset, hardReset }


// reset('animals2');
// hardReset('animals2', 5, 3, 500); // do this for the FIRST

// INSTRUCTIONS:
// 1. First, cd to the kafkaTest folder
// 2. Second, I would suggest (for consistency) deleting your docker container then rebuilding it:
// docker-compose -f docker-compose.yml up -d
//
// if you get caching issues:
// docker-compose build --no-cache kafka1
// docker-compose build --no-cache kafka2
// docker-compose build --no-cache kafka3
// docker-compose up -d
//
// 3. Third, run node test.js. MAKE SURE hardReset('animals2', 5, 3, 500) is NOT commented out
// this will create a topic animals2 with 5 partitions and a rep factor of 3
// send 500 messages to the 5 partitions
// then create 3 consumer groups to read from it, A B and C
// in 3 different partition consumer offset configurations: 3 x ABC, 1 x BAC, and 1 x CAB
// this is the perfect scenario to try out repartitioning
//
// 4. cd to ../server and npm start to run our Express server
//
// 5. on Postman, doa POST request to http://localhost:3000/admin/repartition
// with the following in the body (JSON):
/*
{
    "seedBrokerUrl": "localhost:9092",
    "topicName": "animals2",
    "newTopicName": "animals2_copy",
    "newMinPartitionNumber": 3,
    "newReplicationFactorNumber": 3
}
*/
//
// 6. Wait about 20 seconds while watching your Express server.
// it may seem stuck on "Still waiting for completion", but sometimes it needs 5 seconds or so
// at the end of it, you should see it console.log ENTIRE REPARTITIONING PROCESS HAS BEEN COMPLETED
// and on Postman you should get an object with all the new consumer offsets
// this object was very deliberately designed like this because I can just feed each individual property back
// into kafkaJS to actually reset the offsets for them
//
// 7. If you need to retest again, you don't need to rebuild your Docker containers
// just comment in reset("animals2") instead of hardReset, let it finish, ctrl+C
// then run step 5 again (Postman) - JUST MAKE SURE TO CHANGE THE NEW TOPIC NAME
// reset is necessary because repartitioning creates a lot of excess consumer groups that need to be deleted
// I will work on middleware to delete this for us and also reconfigure their consumer groups to the new topic
