import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInitialData } from '../features/kafkaCluster/kafkaClusterSlice';
import ClusterTotalBytesIn from './ClusterComponents/clusterTotalBytesIn'
import ClusterActiveControllerCount from './ClusterComponents/clusterActiveControllerCount'
import ClusterGlobalPartitionCount from './ClusterComponents/clusterGlobalPartitionCount'
import ClusterOfflinePartitions from './ClusterComponents/clusterOfflinePartitions'
import ClusterTotalBytesOut from './ClusterComponents/clusterTotalBytesOut'
import ClusterTotalMessagesIn from './ClusterComponents/clusterTotalMessagesIn'
import ClusterPercentUnsyncedPartition from './ClusterComponents/clusterPercentUnsyncedPartition'
import ClusterUnderReplicatedPartitions from './ClusterComponents/clusterUnderReplicatedPartitions'


function KafkaCard() {

    const stateInterval = useSelector(state => state.clusterForm.Interval) * 1000
    const status = useSelector(state => state.clusterForm.Status);

    const dispatch = useDispatch();

    // useEffect hook fetches metrics from the Prometheus port
    // The function fetchInitialData will be triggered if the value of global state for status is "on"
    // status in global state is dependant on if the user successfully connects to port
    useEffect(() => {
        if (status === 'on') {
            const interval = setInterval(() => {
                console.log(`This will run every ${stateInterval} second!`);
                dispatch(fetchInitialData())
            }, stateInterval);
            return () => clearInterval(interval);
        }
    }, [stateInterval, status, dispatch]);


    return (
        <>
            <div className='KafkaCard'>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Global Partition Count</h1>
                    <ClusterGlobalPartitionCount />
                </div>
                {/* <div className='graphPlaceholder'>
                <h1>Active Brokers</h1>
            </div> */}
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Under Replicated Partitions</h1>
                    <ClusterUnderReplicatedPartitions />
                </div>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Offline Partitions</h1>
                    <ClusterOfflinePartitions />
                </div>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Active Controller Count</h1>
                    <ClusterActiveControllerCount />
                </div>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Total Bytes In</h1>
                    <ClusterTotalBytesIn />
                </div>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Total Bytes Out</h1>
                    <ClusterTotalBytesOut />
                </div>
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Total Messages In</h1>
                    <ClusterTotalMessagesIn />
                </div>
                {/* <div className='graphPlaceholder'>
                <h1>Error Rate (failed produce or consume requests)</h1>
            </div> */}
                <div className='graphPlaceholder'>
                    <h1 className='metricsHeader'>Percentage of Unsynced Partitions</h1>
                    <ClusterPercentUnsyncedPartition />
                </div>
            </div>
        </>
    )
}

export default KafkaCard;