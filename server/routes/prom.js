const express = require('express');

const promController = require('../controllers/promController.js');

const router = express.Router();

router.get('/', promController.getClusterMetrics, promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json({ ...res.locals.clusterMetrics, ...res.locals.obj });
});

router.get('/broker', promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json(res.locals.obj);
});

router.post('/', promController.verifyPort, (req, res) => {
    return res.status(200).send('Successfully connected to port');
});



module.exports = router;