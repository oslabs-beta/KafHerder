const axios = require('axios');
const fs = require('fs');

const promController = {}

const { clusterMetricNames, brokerMetricNames } = require('../variables/metricNames.js');
// @TODO: stretch: allow users to specify what metric names they want

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;
// {__name__=~"partitioncount|brokercount|partitioncount2|partitioncount3|partitioncount"}

promController.verifyPort = async (req, res, next) => {
    console.log('req.body', req.body)
    try {
        const { promPort } = req.body;
        const connection = await axios.get(`http://localhost:${promPort}`);
        console.log(`Successfully connected to http://localhost:${promPort}`);
        return next();
    }
    // TODO: if does not find port, should send back 404
    catch (err) {
        return next({
            log: `Error in promController.verifyPort: ${err}`,
            status: 400,
            message: { err: 'An error occured inside verifyport' }
        })
    }
};


promController.getBrokerMetrics = async (req, res, next) => {
    try {
        const { promPort } = req.query; 
        console.log('getBrokerMetrics port is', promPort);
        if (!promPort) return next({ err: `Port doesn't exist` });

        const response = await axios.get(`http://localhost:${promPort}/api/v1/query`, {
            params: {
                query: buildQuery(brokerMetricNames)
            }
        });

        const results = response.data.data.result;
        const obj = {};
        for (const result of results) {
            if (!obj[result.metric.instance]) obj[result.metric.instance] = {};
            obj[result.metric.instance][result.metric.__name__] = result.value[1];
        };
        
        res.locals.obj = obj

        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.getBrokerMetrics: ${err}`,
            status: 400,
            message: { err: 'An error ocurred in getBrokerMetrics' }
        })
    }
};

// promController.getClusterMetrics = (param) => {
//     return async (req, res, next) => {
//         try {
//             if (!param) return next({ err: `Port doesn't exist` });
//             const response = await axios.get(`http://localhost:${param}/api/v1/query`, {
//                 params: {
//                     query: buildQuery(clusterMetricNames)
//                 }
//             });
//             res.locals.clusterMetrics = {};
//             const results = response.data.data.result;
//             for (const result of results) {
//                 res.locals.clusterMetrics[result.metric.__name__] = result.value[1];
//             }
//             console.log('now printing cluster metrics')
//             console.log(res.locals.clusterMetrics);
//             return next();
//         }
//         catch (err) {
//             return next({
//                 log: `Error in promController.getClusterMetrics: ${err}`,
//                 status: 400,
//                 message: { err: 'An error ocurred' }
//             })
//         }
//     }
// };

promController.getClusterMetrics = async (req, res, next) => {
    try {
        const { promPort } = req.query; // TODO: fix from this being number to Url
        console.log('query: ', buildQuery(clusterMetricNames));
        if (!promPort) return next({ err: `Port doesn't exist` });
        const response = await axios.get(`http://localhost:${promPort}/api/v1/query`, {
            params: {
                query: buildQuery(clusterMetricNames)
            }
        });
        console.log('response #1', response)
        res.locals.clusterMetrics = {};
        console.log('response.data.data', response.data.data);
        const results = response.data.data.result;
        
        console.log('results', typeof results)
        for (const result of results) {
            res.locals.clusterMetrics[result.metric.__name__] = result.value[1];
        }
        console.log('now printing cluster metrics')
        console.log(res.locals.clusterMetrics);
        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.getClusterMetrics: ${err}`,
            status: 400,
            message: { err: 'An error occurred in getClusterMetrics' }
        })
    }
};

// promController.getAllMetrics = async (req, res, next) => {
//     try {        
//         console.log('about to make request');
//         const response = await axios.get(`http://localhost:${PROMPORT}/api/v1/query`, {
//             params: {
//                 query: buildQuery(metrics)
//             }
//         });
//         res.locals.allMetrics = {};
//         const results = response.data.data.result;
//         for (const result of results){
//             res.locals.allMetrics[result.metric.__name__] = result.value[1];
//         }

//         console.log(res.locals.allMetrics);
//         //res.locals.allMetrics = response.data.data // { metric: metric1, value: response.data.data };
//         return next();
//     }
//     catch (err) {
//         console.log(err);
//         return next(err);
//     }
// } 

promController.getAllMetricNames = async (req, res, next) => {
    try {
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/label/__name__/values');
        console.log('these are the metric names: ', response.data.data);
        res.locals.metricNames = response.data.data;
        await fs.writeFile('newMetrics.txt', res.locals.metricNames.join('\n'), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("metricNames.txt", "utf8"));
            }
        });
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

promController.getRandomMetric = async (req, res, next) => {
    const randomMetric = 'kafka_server_brokertopics';
    // kafka_server_replicamanager_partitioncount{broker="2"}
    // 'kafka_server_kafkaserver_brokerstate'
    // kafka_server_replicamanager_partitioncount{server="3"}
    // const randomMetric = 'kafka_server_brokertopicmetrics_totalproducerequests_total';
    // const randomMetric = res.locals.metricNames[Math.floor(Math.random()*res.locals.metricNames.length)];
    try {
        console.log('about to make request');
        const response = await axios.get(`http://localhost:9090/api/v1/query`, {
            params: {
                query: randomMetric
            }
        });
        console.log(response.data);
        res.locals.metric = { metric: randomMetric, value: response.data.data }; // .result[0].value[0]
        console.log(res.locals.metric.value.result);
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = promController;
