import React from 'react'
import { useSelector } from 'react-redux'

function ClusterPercentUnsyncedPartition() {

  const partitionReplicaCount = useSelector(state => state.kafkaCluster.partitionReplicaCount);
  const partitionInSyncReplicaCount = useSelector(state => state.kafkaCluster.partitionInSyncReplicaCount);

  const percentUnsyncedPartition = ((parseInt(partitionReplicaCount) - parseInt(partitionInSyncReplicaCount)) / parseInt(partitionReplicaCount) * 100).toFixed(2);

  return (
    <div>{percentUnsyncedPartition}%</div>
  )
}

export default ClusterPercentUnsyncedPartition