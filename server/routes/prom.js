const express = require('express');

const promController = require('../controllers/promController.js');

const router = express.Router();

router.get('/', promController.getClusterMetrics, promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json({ 
        clusterMetrics: res.locals.clusterMetrics, 
        brokerMetrics: res.locals.brokerMetrics 
    });
});

router.get('/broker', promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json(res.locals.brokerMetrics);
});

router.post('/', promController.verifyPort, (req, res) => {
    return res.status(200).send('Successfully connected to port.');
});

module.exports = router;