import React from 'react'
import KafkaCard from '../components/KafkaCard'

function KafkaContainer() {
  return (
    <>
    <div className='KafkaContainer'>
      <div id='KafkaContainerTitle'>
        <h1>KAFKA CLUSTER DATA</h1>
        <h1> Producer / Consumer Metrics </h1>
      </div>
    <KafkaCard />
    </div>
    </>
  )
}

export default KafkaContainer