const express = require('express');

const adminController = require('../controllers/adminController.js');

const router = express.Router();

router.post('/', adminController.connectAdmin, adminController.getClusterInfo, adminController.getTopics, adminController.disconnect, (req, res) => {
    return res.status(200).json(res.locals.clusterInfo);
});

router.post('/partitions', adminController.connectAdmin, adminController.getPartitions, adminController.disconnect, (req, res) => {
    return res.status(200).json(res.locals.partitions);
});

router.post('/create', adminController.connectAdmin, adminController.createTopic, adminController.disconnect, (req, res) => {
    return res.status(200).json(res.locals.wasCreated);
});

module.exports = router;