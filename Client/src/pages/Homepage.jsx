import React, { useEffect } from 'react'
import Navbar from '../container/Navbar'
import BrokerContainer from '../container/BrokerContainer'
import KafkaContainer from '../container/KafkaContainer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchedClusterData } from '../features/kafkaCluster/kafkaClusterSlice'




function Homepage() {
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchedClusterData())
  }, [dispatch])

  return (
    <>
      <Navbar />
        <div className='rightContainer' style={{ minWidth: '400px' }}>
          <KafkaContainer />
          <BrokerContainer />
        </div>
    </>
  )
}

export default Homepage