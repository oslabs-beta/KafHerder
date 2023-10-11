const axios = require('axios');
const fs = require('fs');

const promController = {}

// TODO: STRETCH: allow users to specify what metric names they want
const { clusterMetricNames, brokerMetricNames } = require('../variables/metricNames.js');

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;

promController.verifyPort = async (req, res, next) => {
    try {
        const { promPort } = req.body;

        const connection = await axios.get(`http://localhost:${promPort}`);
        if (!connection) return next({
            log: `Error in promController.verifyPort: ${connection}. User entered an unverified port.`,
            status: 404,
            message: { err: 'Please enter a verified port.' }
        })

        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.verifyPort: ${err}`,
            status: 400,
            message: { err: 'An error occured. Please try again later.' }
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
            message: { err: 'An error occured. Please try again later.' }
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
            message: { err: 'An error occured. Please try again later.' }
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
            }});
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

promController.getRandomMetric = async (req, res, next) => {
    const randomMetric = 'kafka_server_brokertopics';
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
