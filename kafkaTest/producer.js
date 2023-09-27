const { Kafka } = require('kafkajs');
const Chance = require('chance');

const topic = 'animals';

const chance = new Chance();

const kafka = new Kafka({
    clientId: 'my-producer',
    brokers: ['localhost:9092', 'localhost:9094', 'localhost:9096']
})

const producer = kafka.producer();
// const consumer = kafka.consumer({ groupId: 'my-producer'});

const produceMessage = async () => {
    console.log('animal sent');
    try {
        await producer.send({
            topic: topic,
            messages: [
                { value: chance.animal() },
            ],
        })
    } catch (error) {
        console.log('Error: ', error);
    }
}

const run = async () => {
    console.log('attempting connection');
    await producer.connect();
    console.log('connected successfully');
    setInterval(produceMessage, 1000)
}

run();

// const run = async () => {
//     console.log('Entering producer');
//     try {
//         await producer.connect();
//         await producer.send({
//             topic: 'test_kafka_topic',
//             messages: [
//                 { value: 'Hello Kafka!' },
//             ],
//         });
//         console.log('Successfully sent message');
//     } catch (err) {
//         console.error("Error while producing: ", err);
//     }
// };

/*
docker-compose -f docker-compose.yml up -d

if you get caching issues:
docker-compose build --no-cache kafka1
docker-compose build --no-cache kafka2
docker-compose build --no-cache kafka3
docker-compose up -d

ENTERING DOCKER TERMINAL (LINUX) AND CREATING TOPIC
docker exec -it kafka /bin/sh
# cd opt/kafka/bin
# kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic animals

READING MESSAGES
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic animals --from-beginning
*/

