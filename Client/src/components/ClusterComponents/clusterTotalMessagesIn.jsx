import React from 'react'
import { useSelector } from 'react-redux'

function ClusterTotalMessagesIn() {

  const totalMessagesIn = useSelector(state => state.kafkaCluster.TotalMessagesIn);

  return (
    <div>{totalMessagesIn}</div>
  )
}

export default ClusterTotalMessagesIn