import React from 'react'
import { useSelector } from 'react-redux'

function ClusterActiveBrokers() {

  const activeBrokers = useSelector(state => state.kafkaCluster.totalBytesIn);

  return (
    <div>{activeBrokers}</div>
  )
}

export default ClusterActiveBrokers

