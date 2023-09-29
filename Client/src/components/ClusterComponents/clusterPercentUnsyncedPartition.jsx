import React from 'react'
import { useSelector } from 'react-redux'

function ClusterPercentUnsyncedPartition() {

  const partitionReplicaCount = useSelector(state => state.kafkaCluster.PartitionReplicaCount);
  const partitionInSyncReplicaCount = useSelector(state => state.kafkaCluster.PartitionInSyncReplicaCount);

  const percentUnsyncedPartition = ((parseInt(partitionReplicaCount) - parseInt(partitionInSyncReplicaCount)) / parseInt(partitionReplicaCount) * 100).toFixed(2);

  return (
    <div>{percentUnsyncedPartition}%</div>
  )
}

export default ClusterPercentUnsyncedPartition