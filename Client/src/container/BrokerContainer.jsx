import React from 'react'
import BrokerCard from '../components/BrokerCard'

function BrokerContainer() {
  return (
    <>
    <div className='BrokerContainer'>
      <div id='BrokerContainerTitle'>
        <h1> Current Brokers </h1>
      </div>
      <section className='CardContainer'>
      <BrokerCard/>
      <BrokerCard/>
      <BrokerCard/>
      <BrokerCard/>
      </section>
    </div>
    </>
  )
}

export default BrokerContainer
