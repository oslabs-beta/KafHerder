import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInitialData } from '../../features/kafkaCluster/kafkaClusterSlice'



function ClusterActiveBrokers() {

  const activeBrokers = useSelector(state => state.kafkaCluster.TotalBytesIn);

  return (
    <div>clusterActiveBrokers</div>
  )
}

export default ClusterActiveBrokers

