import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setRepartitionData, checkRepartitionData} from '../../features/clusterform/clusterFormSlice'

function RepartitionForm() {
    const topicName = useSelector(state => state.clusterForm.selectedTopic);
    const minNumOfPartitions = useSelector(state=>state.clusterForm.mimNumOfPartitions);
    const partitions = useSelector(state=>state.clusterForm.partitionData);
    const numOfpartitions = partitions.length;

    const dispatch = useDispatch();

    const [partitionForm, setPartitionForm] = useState({
        newTopic: '',
        newMinPartitionNum: '',
        newReplicationFactor: ''
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (partitionForm.newMinPartitionNum <= minNumOfPartitions) {
            alert('NOT ENOUGH PARTITIONS');
            throw new Error('NOT ENOUGH PARTITIONS');
        }
        dispatch(setRepartitionData(partitionForm));
        dispatch(checkRepartitionData());
        console.log(partitionForm.newTopic, partitionForm.newMinPartitionNum, partitionForm.newReplicationFactor)   
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPartitionForm(prevState => ({
          ...prevState,
          [name]: value
        }));
      }

  return (
    <div className='repartitionForm-container'>
        <div className='currentTopicDetails'>
            <h3>Topic Name: {topicName}</h3>
            <h3>Current Number Of Partitions: {numOfpartitions}</h3>
            <h3>Minimum Number Of Partitions Required: {minNumOfPartitions}</h3>
        </div>
        <div className='newTopicDetails-container'>
            <div className='newTopicDetails'>
                <h3>New Topic Name: </h3>
                <input 
                className='newTopicDetailsInput' 
                type="text" 
                id='newTopic'
                name='newTopic'
                value={partitionForm.newTopic}
                onChange={handleInputChange}
                placeholder='Input New Topic Name' />
            </div>
            <div className='newTopicDetails'>
                <h3>Number Of Partitions:</h3>
                <input 
                className='newTopicDetailsInput' 
                type="text"
                id='newMinPartitionNum'
                name='newMinPartitionNum' 
                value={partitionForm.newMinPartitionNum}
                onChange={handleInputChange}
                placeholder='Input How Many Partitions To Create' />
            </div>
            <div className='newTopicDetails'>
                <h3>Replication Factor:</h3>
                <input 
                className='newTopicDetailsInput' 
                type="text" 
                id='newReplicationFactor'
                name='newReplicationFactor'
                value={partitionForm.newReplicationFactor}
                onChange={handleInputChange}
                placeholder='Replication Factor' />
            </div>
            <div className='newTopicDetailsButton-container'>
                <button className='newTopicDetails-button' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    </div>
  )
}

export default RepartitionForm