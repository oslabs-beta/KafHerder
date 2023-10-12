import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkPartitionData, setSelectedTopic } from '../../features/clusterform/clusterFormSlice'


function TopicsList() {

    const dispatch = useDispatch();

    const topics = useSelector(state => state.clusterForm.topics)

    const [filter, setFilter] = useState('');
    const [selectedTopicLocal, setSelectedTopicLocal] = useState('');

    const filteredTopics = topics.filter(topic =>
        topic.toLowerCase().includes(filter.toLowerCase())
    );

    // will set local state to topic selected from table
    // will also set global state of selectedTopic to topic selected by user via setSelectedTopic
    const clickTopic = (topic) => {
        console.log(topic)
        setSelectedTopicLocal(topic)
        dispatch(setSelectedTopic(topic))
    }

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        dispatch(checkPartitionData())
    }

    return (
        <div className='TopicContainer'>
            <input
                className='TopicInput'
                type="text"
                placeholder='Enter topic'
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
            <div className='topicsList'>
                {filteredTopics.map((topic, index) => (
                    <div className='topic' key={index}>
                        <p className='topicName' onClick={() => clickTopic(topic)} style={{ backgroundColor: topic === selectedTopicLocal ? '#f69708' : 'transparent' }}>{topic}</p>
                    </div>
                ))}
            </div>
            <button className='TopicSubmitButton' type='submit' onClick={handleTopicSubmit}>Submit</button>
        </div>
    )
}

export default TopicsList
