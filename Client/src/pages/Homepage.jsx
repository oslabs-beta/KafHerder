import React, { useEffect } from 'react'
import LeftContainer from '../container/LeftContainer'
import BrokerContainer from '../container/BrokerContainer'
import KafkaContainer from '../container/KafkaContainer'
import { useDispatch } from 'react-redux'
import { fetchedClusterData } from '../features/kafkaCluster/kafkaClusterSlice'
import NavBar from '../components/NavBar'




function Homepage() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchedClusterData())
  }, [dispatch])

  return (
    <>
      <div className='root'>
        <NavBar />
        <div className='homeContainer'>
          <LeftContainer />
          <div className='rightContainer' style={{ minWidth: '400px' }}>
            <KafkaContainer />
            <BrokerContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Homepage
