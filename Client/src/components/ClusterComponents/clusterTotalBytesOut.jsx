import React from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'

function ClusterTotalBytesOut() {

  const totalBytesOut = useSelector(state => state.kafkaCluster.TotalBytesOut);

  return (
    <div>{totalBytesOut}</div>
  )
}

export default ClusterTotalBytesOut