const axios = require('axios');
const fs = require('fs');

const promController = {}

// TODO: STRETCH: allow users to specify what metric names they want
const { clusterMetricNames, brokerMetricNames } = require('../variables/metricNames.js');

const buildQuery = (arr) => `{__name__=~"${arr.join('|')}"}`;

/**
 * Checks to see if a connection can be made to the user's Prometheus port.
 * 
 * @async
 * @function
 * @param {String} req.body.promPort should be the entire URL (ex. 'http://localhost:9090') 
 */
// TODO: If port isn't found, should send back 404
promController.verifyPort = async (req, res, next) => {
    try {
        const { promPort } = req.body;

        await axios.get(promPort);

        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.verifyPort: ${err}`,
            status: 400,
            message: { err: 'An error occurred: Unable to connect to prometheus port.' }
        })
    }
};

/**
 * Retrieves a list of cluster-related metrics from Prometheus.
 * 
 * @async
 * @function
 * @param {String} req.query.promPort should be the entire URL, including the endpoint '/api/v1/query' (ex. 'http://localhost:9090/api/v1/query') 
 * @returns {Object} res.locals.clusterMetrics will have the following shape:
 * // {   
 * //   "kafka_cluster_partition_insyncreplicascount": "1",
 * //   "kafka_cluster_partition_replicascount": "1",
 * //   "kafka_cluster_partition_underreplicated": "0",
 * //   "kafka_controller_kafkacontroller_activecontrollercount": "0",
 * //   "kafka_controller_kafkacontroller_globalpartitioncount": "0",
 * //   "kafka_controller_kafkacontroller_offlinepartitionscount": "0",
 * //   "kafka_server_brokertopicmetrics_bytesin_total": "0",
 * //   "kafka_server_brokertopicmetrics_bytesout_total": "0",
 * //   "kafka_server_brokertopicmetrics_messagesin_total": "0"
 * // }
 */
promController.getClusterMetrics = async (req, res, next) => {
    try {
        const { promPort } = req.query; 
        console.log(req.query);
        // ! This error handling doesn't work. When an invalid port is entered, GEH is triggered and not the following one.
        if (!promPort) return next({ err: `Port doesn't exist` });
       
        const response = await axios.get(promPort, {
            params: {
                query: buildQuery(clusterMetricNames)
            }
        });
        
        res.locals.clusterMetrics = {};
        const results = response.data.data.result;
        for (const result of results) {
            res.locals.clusterMetrics[result.metric.__name__] = result.value[1];
        }
        
        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.getClusterMetrics: ${err}`,
            status: 400,
            message: { err: 'An error occured: Unable to retrieve metrics at the moment.' }
        })
    }
};

/**
 * Retrieves a list of broker-related metrics from Prometheus.
 * 
 * @async
 * @function
 * @param {String} req.query.promPort should be the entire URL, including the endpoint '/api/v1/query' (ex. 'http://localhost:9090/api/v1/query') 
 * @returns {Object} res.locals.brokerMetrics will separate the metrics by their corresponding broker. Will have the following shape:
 * // kafka1:9992: {
 * //   "kafka_server_brokertopicmetrics_bytesin_total": "0",
 * //   "kafka_server_brokertopicmetrics_bytesout_total": "0",
 * //   "kafka_server_kafkaserver_brokerstate": "3",
 * //   "kafka_server_replicamanager_offlinereplicacount": "0",
 * //   "kafka_server_replicamanager_partitioncount": "23",
 * //   "kafka_server_sessionexpirelistener_zookeeperdisconnects_total": "0"
 * // }
 * // kafka2:9993: {
 * //   "kafka_server_brokertopicmetrics_bytesin_total": "0",
 * //   "kafka_server_brokertopicmetrics_bytesout_total": "0",
 * //   "kafka_server_kafkaserver_brokerstate": "3",
 * //   "kafka_server_replicamanager_offlinereplicacount": "0",
 * //   "kafka_server_replicamanager_partitioncount": "23",
 * //   "kafka_server_sessionexpirelistener_zookeeperdisconnects_total": "0"
 * // }
 */

promController.getBrokerMetrics = async (req, res, next) => {
    try {
        const { promPort } = req.query; 
        // ! Same issue as getClusterMetrics
        if (!promPort) return next({ err: `Port doesn't exist` });

        const response = await axios.get(promPort, {
            params: {
                query: buildQuery(brokerMetricNames)
            }
        });

        res.locals.brokerMetrics = {};
        const results = response.data.data.result;
        for (const result of results) {
            if (!res.locals.brokerMetrics[result.metric.instance]) res.locals.brokerMetrics[result.metric.instance] = {};
            res.locals.brokerMetrics[result.metric.instance][result.metric.__name__] = result.value[1];
        };
        
        return next();
    }
    catch (err) {
        return next({
            log: `Error in promController.getBrokerMetrics: ${err}`,
            status: 400,
            message: { err: 'An error occured: Unable to retrieve metrics at the moment.' }
        })
    }
};


module.exports = promController;
