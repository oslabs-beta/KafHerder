const express = require('express');

const promController = require('../controllers/promController.js');

const router = express.Router();

router.get('/', promController.getClusterMetrics, promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json({ ...res.locals.clusterMetrics, ...res.locals.brokerMetrics });
});

router.get('/broker', promController.getBrokerMetrics, (req, res) => {
    return res.status(200).json(
        // brokerState: res.locals.brokerState, //{ 'kafka1:9992': '3', 'kafka2:9993': '3', 'kafka3:9994': '3' }
        // offlineReplicas: res.locals.offlineReplicas, //{ 'kafka1:9992': '0', 'kafka2:9993': '0', 'kafka3:9994': '0' }
        // partitionCount: res.locals.partitionCount, //{ 'kafka1:9992': '22', 'kafka2:9993': '24', 'kafka3:9994': '23' }
        // zookeeperDisconnects: res.locals.zookeeperDisconnects //{ 'kafka1:9992': '7', 'kafka2:9993': '7', 'kafka3:9994': '7' }
        
        // currently sending it like: 
        // { 'kafka1:9992': '3', 'kafka2:9993': '3', 'kafka3:9994': '3' }
        // { 'kafka1:9992': '0', 'kafka2:9993': '0', 'kafka3:9994': '0' }
        // { 'kafka1:9992': '22', 'kafka2:9993': '24', 'kafka3:9994': '23' }
        // { 'kafka1:9992': '7', 'kafka2:9993': '7', 'kafka3:9994': '7' }
        
        // But we want it like this
        // {
        //     kafka1"9992": {offlineReplicas:xxxx, partitionCount:xxxx, zookeeperDisconnects:xxxx },
        //     kafka2"9993": {offlineReplicas:xxxx, partitionCount:xxxx, zookeeperDisconnects:xxxx },
        //     kafka3"9994": {offlineReplicas:xxxx, partitionCount:xxxx, zookeeperDisconnects:xxxx }
        // }
        res.locals.obj
    );
});

router.post('/', promController.verifyPort, (req, res) => {
    return res.status(200).send('Successfully connected to port');
});

router.get('/names', promController.getAllMetricNames, (req, res) => {
    return res.status(200).send(res.locals.metric);
});

router.get('/random', promController.getRandomMetric, (req, res) => {
    return res.status(200).send(res.locals.metric);
})

module.exports = router;