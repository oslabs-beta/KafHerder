const fetch = require('node-fetch'); // DELETE THIS FROM NPM
const axios = require('axios');
const fs = require('fs');

const promController = {}

const clusterMetricNames = [

];

const brokerMetricNames = [
    'kafka_controller_kafkacontroller_globalpartitioncount',
    'kafka_server_brokertopicmetrics_producemessageconversions_total',
]

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;

// console.log(buildQuery(brokerMetricNames));

promController.getAllMetrics = async (req, res, next) => {
    const metric1 = 'kafka_controller_kafkacontroller_globalpartitioncount';
    const metric2 = 'kafka_server_brokertopicmetrics_producemessageconversions_total';
    try {        
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/query', {
            params: {
                query: buildQuery(brokerMetricNames)
            }
        });
        console.log(response.data.data.result);
        res.locals.allMetrics = response.data.data // { metric: metric1, value: response.data.data };
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}



promController.getAllMetricNames = async (req, res, next) => {
    try {        
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/label/__name__/values');
        console.log('these are the metric names: ', response.data.data);
        res.locals.metricNames = response.data.data;
        // await fs.writeFile('metricNames.txt', res.locals.metricNames.join('\n'), (err) => {
        //     if (err)
        //       console.log(err);
        //     else {
        //       console.log("File written successfully\n");
        //       console.log("The written has the following contents:");
        //       console.log(fs.readFileSync("metricNames.txt", "utf8"));
        //     }});
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

promController.getRandomMetric = async (req, res, next) => {
    const randomMetric = 'kafka_controller_kafkacontroller_globalpartitioncount'
    // const randomMetric = 'kafka_server_brokertopicmetrics_totalproducerequests_total';
    // const randomMetric = res.locals.metricNames[Math.floor(Math.random()*res.locals.metricNames.length)];
    try {        
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/query', {
            params: {
                query: randomMetric
            }
        });
        // console.log('these are the metric names: ', response.data.data);
        res.locals.metric = { metric: randomMetric, value: response.data.data }; // .result[0].value[0]
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = promController;