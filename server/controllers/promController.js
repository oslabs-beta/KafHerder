const axios = require('axios');
const fs = require('fs');

const promController = {}

let metrics = [
    
    'kafka_controller_kafkacontroller_globalpartitioncount',
    'kafka_cluster_partition_underreplicated',
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    'kafka_controller_kafkacontroller_activecontrollercount',
    'kafka_server_brokertopicmetrics_bytesin_total',
    'kafka_server_brokertopicmetrics_bytesout_total',
    'kafka_server_brokertopicmetrics_messagesin_total',
    'kafka_cluster_partition_replicascount',
    'kafka_cluster_partition_insyncreplicascount',
    'kafka_controller_kafkacontroller_globaltopiccount'
]

const clusterMetricNames = [
    // * Under replicated partitions
    'kafka_server_replicamanager_underreplicatedpartitions',
    'kafka_cluster_partition_underreplicated',
    // * Offline partitions count
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    // * BytesInPerSec
    'kafka_server_brokertopicmetrics_bytesin_total',
    // * BytesOutPerSec
    'kafka_server_brokertopicmetrics_bytesout_total',
];

const brokerMetricNames = [
    'kafka_controller_kafkacontroller_globalpartitioncount',
    'kafka_server_brokertopicmetrics_producemessageconversions_total',
]

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;

// {__name__=~"partitioncount|brokercount|partitioncount2|partitioncount3|partitioncount|4"}

// console.log(buildQuery(brokerMetricNames));

promController.getAllMetrics = async (req, res, next) => {
    try {        
        console.log('about to make request');
        const response = await axios.get('http://localhost:9090/api/v1/query', {
            params: {
                query: buildQuery(metrics)
            }
        });
        res.locals.allMetrics = {};
        const results = response.data.data.result;
        for (const result of results){
            res.locals.allMetrics[result.metric.__name__] = result.value[1];
        }

        console.log(res.locals.allMetrics);
        //res.locals.allMetrics = response.data.data // { metric: metric1, value: response.data.data };
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