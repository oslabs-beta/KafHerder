import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'

function ClusterTotalBytesOut() {

  const [pulse, setPulse] = useState(false);

  const totalBytesOut = useSelector(state => state.kafkaCluster.TotalBytesOut);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [totalBytesOut]);

  return (
    <div className={pulse ? 'pulseEffect' : ''}>{totalBytesOut}</div>
  )
}

export default ClusterTotalBytesOut