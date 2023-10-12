import React from 'react'
import { useSelector } from 'react-redux'

function ClusterGlobalPartitionCount() {

  const globalPartitionCount = useSelector(state => state.kafkaCluster.globalPartitionCount);

  return (
    <div>{globalPartitionCount}</div>
  )
}

export default ClusterGlobalPartitionCount