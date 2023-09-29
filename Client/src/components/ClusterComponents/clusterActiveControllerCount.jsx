import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


/**
 * TODO anything other than 1 should turn red
 */

function ClusterActiveControllerCount() {

  const activeControllers = useSelector(state => state.kafkaCluster.ActiveControllerCount);

  return (
    <div>{activeControllers}</div>
  )
}

export default ClusterActiveControllerCount










