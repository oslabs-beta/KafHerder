import React from 'react'
import { useSelector } from 'react-redux'

function ClusterUnderReplicatedPartitions() {

  const underReplicatedPartitions = useSelector(state => state.kafkaCluster.underReplicatedPartitions);

  return (
    <div>{underReplicatedPartitions}</div>
  )
}

export default ClusterUnderReplicatedPartitions