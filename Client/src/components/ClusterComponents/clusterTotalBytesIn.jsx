import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInitialData } from '../../features/kafkaCluster/kafkaClusterSlice'



function ClusterTotalBytesIn() {

  const bytesIn = useSelector(state => state.kafkaCluster.TotalBytesIn);

  return (
    <div>{bytesIn}</div>
  )
}

export default ClusterTotalBytesIn