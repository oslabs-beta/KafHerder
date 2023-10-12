import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setRepartitionData, checkRepartitionData } from '../../features/clusterform/clusterFormSlice'



function RepartitionForm() {
    const topicName = useSelector(state => state.clusterForm.selectedTopic);
    const minNumOfPartitions = useSelector(state => state.clusterForm.mimNumOfPartitions);
    const partitions = useSelector(state => state.clusterForm.partitionData);
    const numOfpartitions = Object.keys(partitions).length;
    const repartitionStatus = useSelector(state => state.clusterForm.repartitionStatus)
    const repartitionResult = useSelector(state => state.clusterForm.repartitionResult)
    const newTopic = useSelector(state => state.clusterForm.newTopic)
    const newMinPartitionNum = useSelector(state=>state.clusterForm.newMinPartitionNum)

    const dispatch = useDispatch();

    // Creating local state for input data
    const [partitionForm, setPartitionForm] = useState({
        newTopic: '',
        newMinPartitionNum: '',
        newReplicationFactor: ''
    });

    const [modal, setModal] = useState(false);

    const Modal = ({ closeModal }) => {

        return (
            <div className="modal" style={{ overflowY: 'scroll' }}>
                <span className="modal-close" onClick={closeModal}>&times;</span>
                {modalContent}
            </div>
        );
    };

    let modalContent;
    switch (repartitionStatus) {
        case 'pending':
            modalContent = <div className='loadingModal'>
                                <h1>Loading...</h1>
                                <div className='spin'></div>
                            </div>
            break;
        case 'done':
            modalContent = <div>
                <h1>Repartitioning Complete!</h1>
                <p>Successfully repartitioned to {newMinPartitionNum} partitions in new topic {newTopic}.</p>
                <p>Consumers groups can continue reading from {newTopic} without missing messages or reading any twice.</p>
                <p>Here are their new offsets:</p>
                <pre>{JSON.stringify(repartitionResult, null, 2)}</pre>
            </div>
            break;
        default:
            modalContent = <h1>What would be default?</h1>
            break;
    }

    // when the form is submitted, state is dispatched from the partitionForm to the redux store using checkRepartitionData
    // handle submit also triggers post request to the server with topic selected by the user to fetch topic data
    const handleSubmit = (e) => {
        e.preventDefault();
        if (partitionForm.newMinPartitionNum < minNumOfPartitions) {
            alert('NOT ENOUGH PARTITIONS');
            throw new Error('NOT ENOUGH PARTITIONS');
        }
        dispatch(setRepartitionData(partitionForm));
        dispatch(checkRepartitionData());
        setModal(true);
    }

    // event handler that updates the partitionForm based on what inputs are put in
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
                    <button className='newTopicDetails-button' onClick={handleSubmit}>Start Repartition</button>
                </div>
            </div>
            {modal && <div className="modal-overlay" onClick={() => setModal(false)}></div>}
            {modal && <Modal closeModal={() => setModal(false)} />}
        </div>
    )
}

export default RepartitionForm