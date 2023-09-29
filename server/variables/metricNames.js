const metrics = [
    // * Broker underreplicated partitions
    'kafka_server_replicamanager_underreplicatedpartitions',
    // * ISR Expands/Sec & ISR Shrinks/Sec 
    'kafka_server_replicamanager_isrexpands_total',
    'kafka_server_replicamanager_isrshrinks_total',
    // * Leader Election Rate and Time Ms
    'kafka_controller_controllerstats_leaderelectionrateandtimems',
    // * Unclean Leader Elections Per Sec
    'kafka_controller_controllerstats_uncleanleaderelectionenablerateandtimems',
    'kafka_controller_controllerstats_uncleanleaderelectionenablerateandtimems_count',
    'kafka_controller_controllerstats_uncleanleaderelections_total',
    // * Total Time Ms (Producer, FetchConsumer, FetchFollower)
    'kafka_network_requestmetrics_totaltimems',
    // * Purgatory Size
    'kafka_server_delayedoperationpurgatory_purgatorysize',
    // * Requests Per Second
    'kafka_network_requestmetrics_requests_total'
];

const clusterMetricNames = [
    // * Under replicated partitions
    'kafka_cluster_partition_underreplicated',
    // * Offline partitions count
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    // * BytesInPerSec
    'kafka_server_brokertopicmetrics_bytesin_total',
    // * BytesOutPerSec
    'kafka_server_brokertopicmetrics_bytesout_total',
    // Global partition count
    'kafka_controller_kafkacontroller_globalpartitioncount',
    // * Active controller count
    'kafka_controller_kafkacontroller_activecontrollercount',
    // * Total messages in
    'kafka_server_brokertopicmetrics_messagesin_total',
    // * Partition replicas
    'kafka_cluster_partition_replicascount',
    // * Insync replicas
    'kafka_cluster_partition_insyncreplicascount'
];

const brokerMetricNames = [
    'kafka_server_brokertopicmetrics_producemessageconversions_total',
    // * Offline partition count
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    // * Global partition count
    'kafka_controller_kafkacontroller_globalpartitioncount'
];

module.exports = {
    clusterMetricNames,
    brokerMetricNames,
}