import React from 'react'
import { useSelector } from 'react-redux'

function ClusterOfflinePartitions() {

  const offlinePartitions = useSelector(state => state.kafkaCluster.offlinePartitions);

  return (
    <div>{offlinePartitions}</div>
  )
}

export default ClusterOfflinePartitions