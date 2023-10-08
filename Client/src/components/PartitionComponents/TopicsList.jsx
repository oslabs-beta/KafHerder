import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// receiving an object with key: topics with value of array
const topicsTest = { topics: ['topic1', 'topic2', 'topic3', 'kafka1', 'kafka2', 'kafka3', 'test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'] }


function TopicsList() {

    // const topics = useSelector(state => state.clusterForm.topics)

    const [filter, setFilter] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    
    const filteredTopics = topicsTest.topics.filter(topic => 
        topic.toLowerCase().includes(filter.toLowerCase())
    );

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        console.log(selectedTopic)
        // setSelectedTopic('')
    }

    // will set local state to topic selected from table
    const handleTopicClick = (topic) => {
        setSelectedTopic(topic)
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
                        <p className='topicName'onClick={() => handleTopicClick(topic)} style={{backgroundColor: topic === selectedTopic ? 'lightgray' : 'transparent'}}>{topic}</p>
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
