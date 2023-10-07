const express = require('express');

const promController = require('../controllers/promController.js');

const router = express.Router();

router.get('/', promController.getClusterMetrics, promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json({ ...res.locals.clusterMetrics, ...res.locals.brokerMetrics });
});

router.get('/broker', promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json(brokerMetrics);
});

router.post('/', promController.verifyPort, (req, res) => {
    return res.status(200).send('Successfully connected to port');
});

// router.get('/names', promController.getAllMetricNames, (req, res) => {
//     return res.status(200).send(res.locals.metric);
// });

// router.get('/random', promController.getRandomMetric, (req, res) => {
//     return res.status(200).send(res.locals.metric);
// })

module.exports = router;