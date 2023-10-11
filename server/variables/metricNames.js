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
    // * Broker state (shows if broker is a leader)
        // 0: The broker is not running.
        // 1: The broker is starting.
        // 2: The broker is running as a follower.
        // 3: The broker is running as a leader.
        // 4: The broker is shutting down.
    'kafka_server_kafkaserver_brokerstate',
    // * Total partition count per broker (including replicas)
    'kafka_server_replicamanager_partitioncount',
    // * Offline replicas per broker
    'kafka_server_replicamanager_offlinereplicacount',
    // * Total broker disconnects from zookeper
    'kafka_server_sessionexpirelistener_zookeeperdisconnects_total',
    // * Bytes in * out per broker
    'kafka_server_brokertopicmetrics_bytesin_total',
    'kafka_server_brokertopicmetrics_bytesout_total'
];

module.exports = {
    clusterMetricNames,
    brokerMetricNames,
}