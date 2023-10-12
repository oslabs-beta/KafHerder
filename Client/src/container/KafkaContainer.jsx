import React from 'react'
import KafkaCard from '../components/KafkaCard'

function KafkaContainer() {
  
  return (
    <>
    <div className='KafkaContainer'>
      <div id='KafkaContainerTitle'>
        <h1 id='KafkaClusterDataTitle'>Kafka Cluster Data</h1>
        <h3>Producer & Consumer Metrics </h3>
      </div>
    <KafkaCard />
    </div>
    </>
  )
}

export default KafkaContainer