import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInitialData } from '../../features/kafkaCluster/kafkaClusterSlice'



function ClusterActiveBrokers() {

  const activeBrokers = useSelector(state => state.kafkaCluster.totalBytesIn);

  return (
    <div>clusterActiveBrokers</div>
  )
}

export default ClusterActiveBrokers

