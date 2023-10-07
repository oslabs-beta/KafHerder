import React from 'react'
import NavBar from '../components/NavBar'
import LeftContainer from '../container/LeftContainer'
import TopicsList from '../components/PartitionComponents/TopicsList'


// creating repartition page that has navbar and the repartition container that will have:
// port number
// topic drop down
// topic info (once drop down is selected?)
// create new topic and how many partitions

function Repartition() {
  return (
    <>
      <div className='root'>
        <NavBar />
        <div className='homeContainer'>
          <LeftContainer />
          <div className='rightContainer' style={{ minWidth: '400px' }}>
            <TopicsList />
          </div>
        </div>
      </div>
    </>
  )
}

export default Repartition




