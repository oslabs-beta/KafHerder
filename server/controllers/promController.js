const axios = require('axios');
const fs = require('fs');

const promController = {}

let PROMPORT 
// = 9090; // TODO: this doesn't work and save globally... it isn't state. next time the promcontroller is entered it isn't saved
// // use extension like todo highlight todo tree better comments
// // TODO: how to use state in express?

const { clusterMetricNames, brokerMetricNames } = require('../variables/metricNames.js');

// console.log(clusterMetricNames);

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;
// {__name__=~"partitioncount|brokercount|partitioncount2|partitioncount3|partitioncount"}

promController.verifyPort = async (req, res, next) => {
    try {
        const { port } = req.body;
        const connection = await axios.get(`http://localhost:${port}`);
        PROMPORT = port;
        console.log(`Successfully connected to http://localhost:${port}`);
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

// promController.getBrokerMetrics = (param) => {
//     return async (req, res, next) => {
//         try {
//             if (!param) return next({ err: `Port doesn't exist` });
//             const response = await axios.get(`http://localhost:${param}/api/v1/query`, {
//                 params: {
//                     query: buildQuery(brokerMetricNames)
//                 }
//             });
//             res.locals.brokerMetrics = {};
//             const results = response.data.data.result;
//             for (const result of results) {
//                 res.locals.brokerMetrics[result.metric.__name__] = result.value[1];
//             }
//             console.log('now printing broker metrics');

//             console.log(res.locals.brokerMetrics);
//             return next();
//         }
//         catch (err) {
//             return next({
//                 log: `Error in promController.getBrokerMetrics: ${err}`,
//                 status: 400,
//                 message: { err: 'An error ocurred' }
//             })
//         }
//     }
// };

promController.getBrokerMetrics = async (req, res, next) => {
    try {
        const port = req.query.port; // added by Caheri
        console.log('getBrokerMetrics port is', port);
        PROMPORT = port; // added by Caheri
        if (!PROMPORT) return next({ err: `Port doesn't exist` });
        const response = await axios.get(`http://localhost:${PROMPORT}/api/v1/query`, {
            params: {
                query: buildQuery(brokerMetricNames)
            }
        });
        res.locals.brokerMetrics = {};
        const results = response.data.data.result;
        for (const result of results) {
            res.locals.brokerMetrics[result.metric.__name__] = result.value[1];
        }
        console.log('now printing broker metrics');

        console.log(res.locals.brokerMetrics);
        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.getBrokerMetrics: ${err}`,
            status: 400,
            message: { err: 'An error ocurred' }
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
        if (!PROMPORT) return next({ err: `Port doesn't exist` });
        const response = await axios.get(`http://localhost:${PROMPORT}/api/v1/query`, {
            params: {
                query: buildQuery(clusterMetricNames)
            }
        });
        res.locals.clusterMetrics = {};
        const results = response.data.data.result;
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
            message: { err: 'An error ocurred' }
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
// LOL Cahera ended the meeting >->

promController.getAllMetricNames = async (req, res, next) => {
    try {        
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/label/__name__/values');
        console.log('these are the metric names: ', response.data.data);
        res.locals.metricNames = response.data.data;
        await fs.writeFile('metricNames3.txt', res.locals.metricNames.join('\n'), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("metricNames.txt", "utf8"));
            }});
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

promController.getRandomMetric = async (req, res, next) => {
    const randomMetric = 'kafka_log_log_size';
    // const randomMetric = 'kafka_server_brokertopicmetrics_totalproducerequests_total';
    // const randomMetric = res.locals.metricNames[Math.floor(Math.random()*res.locals.metricNames.length)];
    try {        
        console.log('about to make request');
        const response = await axios.get(`http://localhost:9090/api/v1/query`, {
            params: {
                query: randomMetric
            }
        });
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