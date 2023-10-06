import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function ClusterOfflinePartitions() {

  const offlinePartitions = useSelector(state => state.kafkaCluster.offlinePartitions);

  return (
    <div>{offlinePartitions}</div>
  )
}

export default ClusterOfflinePartitions