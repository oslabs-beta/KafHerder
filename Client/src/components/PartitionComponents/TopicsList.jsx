import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkPartitionData, setSelectedTopic } from '../../features/clusterform/clusterFormSlice'

// receiving an object with key: topics with value of array
// const topicsTest = { topics: ['topic1', 'topic2', 'topic3', 'kafka1', 'kafka2', 'kafka3', 'test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'] }


function TopicsList() {

    const dispatch = useDispatch();

    const topics = useSelector(state => state.clusterForm.topics)
    // const topicName = useSelector(state => state.clusterForm.selectedTopic)

    const [filter, setFilter] = useState('');
    const [selectedTopicLocal, setSelectedTopicLocal] = useState('');

    const filteredTopics = topics.filter(topic =>
        topic.toLowerCase().includes(filter.toLowerCase())
    );

    // will set local state to topic selected from table
    // will also set global state of selectedTopic to topic user clicked on
    const clickTopic = (topic) => {
        console.log(topic)
        setSelectedTopicLocal(topic) // for css
        dispatch(setSelectedTopic(topic))
    }

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        console.log(topicName)
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
                        <p className='topicName' onClick={() => clickTopic(topic)} style={{ backgroundColor: topic === selectedTopicLocal ? 'lightgray' : 'transparent' }}>{topic}</p>
                    </div>
                ))}
            </div>
            <button className='TopicSubmitButton' type='submit' onClick={handleTopicSubmit}>Submit</button>
        </div>
    )
}

export default TopicsList

// input bar
// another div that will hold topics list
// submit button
