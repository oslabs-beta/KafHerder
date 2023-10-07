import React from 'react'

// receiving an object with key: topics with value of array
const topicsTest = { topics: ['topic1', 'topic2', 'topic3'] }


function TopicsList() {

    return (
        <div className='TopicContainer'>       
            <input type="text" placeholder='Enter topic' />   
            <div> <p>Testing</p> </div> 
        </div>
    )
}

export default TopicsList

// input bar
// another div that will hold topics list
// submit button