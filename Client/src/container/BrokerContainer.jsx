import React from 'react'
import BrokerCard from '../components/BrokerCard'


/**
 * TODO: create a map function that will take in data for broker cards and display 
 * 
 */
function BrokerContainer() {
  return (
    <>
    <div className='BrokerContainer'>
      <div id='BrokerContainerTitle'>
        <h1> Current Brokers / Dynamic Header? </h1>
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
