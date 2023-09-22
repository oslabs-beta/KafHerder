import React from 'react'
import Navbar from '../container/Navbar'
import BrokerContainer from '../container/BrokerContainer'
import KafkaContainer from '../container/KafkaContainer'

function Homepage() {
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