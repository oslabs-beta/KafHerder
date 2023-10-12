import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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