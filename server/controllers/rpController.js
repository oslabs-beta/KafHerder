const { Kafka } = require('kafkajs');
const rpController = {};

// REPARTITIONING STRATEGY SO FAR
// 1. List all consumer groups via admin.listGroups()
// 2. For each group, check if it exists in the topic in question admin.fetchOffsets({ groupId, topics: [topicName]})
// 3. If it does (presumably returns non-empty array), fetch the consumer group offset for that and save it
// 4. Save all these an object or other data structure:
//    - key: partition #
//    - value: consumer groups + their offsets, SORTED by offsets. maybe a configuration too
// 5. 
// ...
// 99. You can create new consumer groups and SET the new consumer group offsets for them

rpController.connectConsumers = async (req, res, next) => {
    try {
        const { seedBroker, oldTopic, newTopic, numPartitionsOld, numPartitionsNew } = req.body;

        res.locals.connectedConsumers = [];

        for (let i = 0; i < numPartitionsOld; i++){
            const kafka = new Kafka({
                clientId: `consumer-${i}`,
                brokers: [ seedBroker ]
            });
            const consumer = kafka.consumer({ groupId: `rp-${oldTopic}:${newTopic}` });
            
            await consumer.connect();
            await consumer.subscribe({ topics: [oldTopic] });

            res.locals.connectedConsumers.push(consumer);
            return next();
        }
    }
    catch (err) {
      return next({
          log: `Error in rpController.connectConsumers: ${err}`,
          status: 400,
          message: { err: 'An error occured' }
      })
    }
  };

  // presumably, if the previous partitions were all in order for each (which is guaranteed)
  // the user did not care if one consumer was reading partition 1 and another partition 2 at the same time
  // order may be lost between them, but they don't care
  // 