import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function ClusterGlobalPartitionCount() {

  const globalPartitionCount = useSelector(state => state.kafkaCluster.globalPartitionCount);

  return (
    <div>{globalPartitionCount}</div>
  )
}

export default ClusterGlobalPartitionCount