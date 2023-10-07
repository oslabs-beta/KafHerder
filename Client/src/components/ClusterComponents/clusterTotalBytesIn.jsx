import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchedClusterData } from '../../features/kafkaCluster/kafkaClusterSlice'



function ClusterTotalBytesIn() {

  const [pulse, setPulse] = useState(false);

  const bytesIn = useSelector(state => state.kafkaCluster.totalBytesIn);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [bytesIn]);

  return (
    <div className={pulse ? 'pulseEffect' : ''}>{bytesIn}</div>
  )
}

export default ClusterTotalBytesIn