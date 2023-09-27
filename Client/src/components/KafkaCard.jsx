import React from 'react';

function KafkaCard() {
    return (
    <>
        <div className='KafkaCard'>
            <div className='graphPlaceholder'>
                <h1>kafka_controller_kafkacontroller_globalpartitioncount</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Active Brokers</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Under Replicated Partitions - kafka_cluster_partition_underreplicated</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Offline Partitions - kafka_controller_kafkacontroller_offlinepartitionscount</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Controller - kafka_controller_kafkacontroller_activecontrollercount</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Total Bytes in - Brokers * kafka_server_brokertopicmetrics_bytesin_total</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Total Bytes out - Brokers * kafka_server_brokertopicmetrics_bytesout_total</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Total Messages In - Brokers * kafka_server_brokertopicmetrics_messagesin_total</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Error Rate (failed produce or consume requests)</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Percent of non synced partition - (kafka_cluster_partition_replicascount - kafka_cluster_partition_insyncreplicascount) / kafka_cluster_partition_replicascount </h1>
            </div>
        </div>
    </>
    )
}

export default KafkaCard;