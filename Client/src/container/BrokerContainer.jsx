import React from 'react'
import BrokerCard from '../components/BrokerCard'


/**
 * TODO: create a map function that will take in data for broker cards and display 
 * 
 */
const brokerData = [
  {BrokerId: '1', ActiveControllerCount: '1', PartitionCount: '10'},
  {BrokerId: '2', ActiveControllerCount: '1', PartitionCount: '8'},
  {BrokerId: '3', ActiveControllerCount: '1', PartitionCount: '7'},
  {BrokerId: '4', ActiveControllerCount: '1', PartitionCount: '9'}
]
function BrokerContainer() {
  const renderedBrokerCards = brokerData.map((data) => (
  <BrokerCard key={data.BrokerId} data={data} />
  ))
  return (
    <>
    <div className='BrokerContainer'>
      <div id='BrokerContainerTitle'>
        <h1> Current Brokers: {brokerData.length} </h1>
      </div>
      <section className='CardContainer'>
        {renderedBrokerCards}
      </section>
    </div>
    </>
  )
}

export default BrokerContainer
