const express = require('express');

const adminController = require('../controllers/adminController.js');

const router = express.Router();

router.post('/', adminController.connectAdmin, adminController.getClusterInfo, adminController.getTopics, adminController.disconnectAdmin, (req, res) => {
    console.log(`Cluster info: `, res.locals.clusterInfo);
    return res.status(200).json(res.locals.clusterInfo);
});

router.post('/partitions', adminController.connectAdmin, adminController.getPartitions, adminController.disconnectAdmin, (req, res) => {
    console.log(`Partitions info: `, res.locals.clusterInfo);
    return res.status(200).json(res.locals.partitions);
});

router.post('/create', adminController.connectAdmin, adminController.createTopic, adminController.disconnectAdmin, (req, res) => {
    console.log(`${res.locals.wasCreated ? 'Successfully created topic!' : 'Topic already exists!'}`);
    return res.status(200).json(res.locals.wasCreated);
});

router.post('/minPartitions', adminController.connectAdmin, adminController.fetchConsumerGroupIds, adminController.fetchPartitionEnds, adminController.calculateTopicConfigs, adminController.disconnectAdmin, (req, res) => {
    return res.status(200).json(res.locals.topicObj);
});

// expected body
// seedBrokerUrl: kafkaPortUrl, 
// topicName: topic,
// newTopicName: newTopic,
// newMinPartitionNumber: newMinPartitionNum,
// newReplicationFactorNumber: newReplicationFactor
router.post('/repartition',
            adminController.connectAdmin, 
            adminController.createTopic,
            adminController.fetchConsumerGroupIds,
            adminController.fetchPartitionEnds,
            adminController.calculateTopicConfigs,
            adminController.disconnectAdmin, 
            adminController.repartition,
            (req, res) => res.status(200).json(res.locals.newConsumerOffsets)
);

module.exports = router;