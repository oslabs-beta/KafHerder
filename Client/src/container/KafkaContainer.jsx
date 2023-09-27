import React from 'react'
import KafkaCard from '../components/KafkaCard'

function KafkaContainer() {
  return (
    <>
    <div className='KafkaContainer'>
      <div id='KafkaContainerTitle'>
        <h3>KAFKA CLUSTER DATA</h3>
        <h3> Producer / Consumer Metrics </h3>
      </div>
    <KafkaCard />
    </div>
    </>
  )
}

export default KafkaContainer