import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import { fetchBrokerData } from '../features/broker/brokerSlice';
import BrokerCard from '../components/BrokerComponents/BrokerCard'


/**
 * Need to change that once we get streaming data. 
 */
// const testData = [
//   {BrokerId: 1, ActiveControllerCount: 1, TotalPartitionCount: 10, OnlinePartitions: 10, OfflinePartitions: 0},
//   {BrokerId: 2, ActiveControllerCount: 1, TotalPartitionCount: 8, OnlinePartitions: 6, OfflinePartitions: 2},
//   {BrokerId: 3, ActiveControllerCount: 1, TotalPartitionCount: 7, OnlinePartitions: 3, OfflinePartitions: 4},
//   {BrokerId: 4, ActiveControllerCount: 1, TotalPartitionCount: 7, OnlinePartitions: 7, OfflinePartitions: 0},
//   {BrokerId: 5, ActiveControllerCount: 1, TotalPartitionCount: 7, OnlinePartitions: 6, OfflinePartitions: 1},
//   {BrokerId: 6, ActiveControllerCount: 1, TotalPartitionCount: 9, OnlinePartitions: 6, OfflinePartitions: 3}
// ]

function BrokerContainer() {

  // once the broker data is fetched, Redux state will be updated with data from server
  const brokers = useSelector(state => state.broker.brokers);
  const allBrokers = brokers.allIds;

  // create local state for sort criteria and set the initial state to 'BrokerIdAscending'
  const [sortCriteria, setSortCriteria] = useState('BrokerIdAscending');


  /** SORTING THE DATA
   * Creates a sortedData variable and sets it to an array.
   * The array will sort the brokerData and sort it to what the current local state's setting
   * */
  const sortedData = [...allBrokers].sort((a, b) => {
    const aPort = parseInt(a.split(':')[1]);
    const bPort = parseInt(b.split(':')[1]);
    if (sortCriteria === 'BrokerIdAscending') {
      return aPort - bPort;
    }
    if (sortCriteria === 'BrokerIdDescending') {
      return bPort - aPort;
    }
    // we can add more criteria here
    return 0;
  })

  /**
   * Created a select element and set it to the id 'sortbydrop'
   * It currently has 2 options, BrokerIdAscending and BrokerIdDescending
   * We can add more for Partition count or any other metrics
   * Whichever one is selected sets off an onChange that will set the local state to whatever was selected
   * Whatever was selected triggers a rerender from the onChange event handler
   */
  const renderedBrokerCards = sortedData.map(id => {
    const brokerData = brokers.byId[id];
    return <BrokerCard key={id} data={brokerData} />
  }
  )

  return (
    <>
      <div className='BrokerContainer'>
        <div id='BrokerContainerTitle'>
          <h1 id='brokerheader' style={{ color: '#101010' }}> Current Brokers: {sortedData.length} </h1>
          {/* <label id='sortby'>Sort by:</label> */}
          <select id='sortbydrop' value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
            <option value="BrokerIdAscending">Sort By: Broker ID Ascending</option>
            <option value="BrokerIdDescending">Sort By: Broker ID Descending</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <section className='CardContainer'>
          {renderedBrokerCards}
        </section>
      </div>
    </>
  )
}

export default BrokerContainer
