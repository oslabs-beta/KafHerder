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
    // ? In cluster
    // * Offline partition count
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    // ? In cluster
    // * Global partition count
    'kafka_controller_kafkacontroller_globalpartitioncount',
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
    
];

module.exports = {
    clusterMetricNames,
    brokerMetricNames,
}