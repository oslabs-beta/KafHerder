const { Kafka } = require('kafkajs');
const rpController = {};

// to start with, run one consumer to the previous topic
// simultaenously producing to the new topic
// no need for an array

// make one consumer for each partition
// have them all run concurrently until they hit their first offsets, then pause them
// once everyone has read up until their first offset, continue to the next
// and so on and so forth

// delete consumer group at end of it

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