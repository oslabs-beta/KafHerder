import React from 'react'
import { useSelector } from 'react-redux'


/**
 * TODO anything other than 1 should turn red
 */

function ClusterActiveControllerCount() {

  const activeControllers = useSelector(state => state.kafkaCluster.activeControllerCount);

  return (
    <div>{activeControllers}</div>
  )
}

export default ClusterActiveControllerCount










