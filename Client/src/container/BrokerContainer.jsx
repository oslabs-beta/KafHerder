import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchBrokerData } from '../features/broker/brokerSlice';
import BrokerCard from '../components/BrokerCard'


/**
 * TODO: currently passing testData into sortedData as data stream
 * Need to change that once we get streaming data. 
 * Look at the 
 * 
 */
const testData = [
  {BrokerId: '1', ActiveControllerCount: '1', PartitionCount: '10'},
  {BrokerId: '2', ActiveControllerCount: '1', PartitionCount: '8'},
  {BrokerId: '3', ActiveControllerCount: '1', PartitionCount: '7'},
  {BrokerId: '4', ActiveControllerCount: '1', PartitionCount: '7'},
  {BrokerId: '5', ActiveControllerCount: '1', PartitionCount: '7'},
  {BrokerId: '6', ActiveControllerCount: '1', PartitionCount: '9'}
]

function BrokerContainer() {


/** 
 * Todo: Uncomment dispatch, useEffect, brokerData, status after server is up.
 * Created a dispatch variable and set it to useDispatch.
 * Will be used in the useEffect(todo after render) to fetch broker data. 
 * fetchBrokerData is a createAsyncThunk function in brokerSlice. Look there to find more info.
 * 
 */

// const dispatch = useDispatch();

// // fetching data once the component mounts
// useEffect(() => {
//   dispatch(fetchBrokerData());
// }, [dispatch]);

// // once the broker data is fetched, Redux state will be updated with data from server
// const brokerData = useSelector(state => state.broker);
// const status = useSelector(state => state.status);

// create local state for sort criteria
const [sortCriteria, setSortCriteria] = useState('BrokerIdAscending');

// sort the data
//**TODO: change testData to brokerData when server is up*/
const sortedData = [...testData].sort((a, b) => {
  if (sortCriteria === 'BrokerIdAscending') {
    return a.BrokerId - b.BrokerId;
  }
  if (sortCriteria === 'BrokerIdDescending') {
    return b.BrokerId - a.BrokerId;
  }
  // we can add more criteria here
  return 0;
})


  /**
   * This part of the code is rendering the hardcoded brokerData from above. 
   * Keeping it like this until I can fetch data from server
   */
  const renderedBrokerCards = sortedData.map((data) => (
  <BrokerCard key={data.BrokerId} data={data} />
  ))
  return (
    <>
    <div className='BrokerContainer'>
      <div id='BrokerContainerTitle'>
        <h1 id='brokerheader'> Current Brokers: {sortedData.length} </h1>
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
