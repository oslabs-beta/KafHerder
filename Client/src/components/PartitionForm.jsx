
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkKafkaPort, setKafkaPort } from '../features/clusterform/clusterFormSlice'

function PartitionForm() {

    // Creating local state for input data
    const [partitionForm, setPartitionForm] = useState({
        kafkaPort: '',
    });

    const dispatch = useDispatch();

    // event handler that updates the localForm based on what inputs are put in
    // Example: This it the input from the form div for the ClusterName input bar
    // name='ClusterName'
    // value={localForm.ClusterName}
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPartitionForm(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  
    // when the form is submitted, state is dispatched from the localForm to the redux store using setClusterForm
    // *We still need to create a clusterFormService to get data from the API
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(setKafkaPort(partitionForm));
      dispatch(checkKafkaPort(partitionForm)); // TODO: ask backend team about route to connect to kafka port
      console.log(partitionForm.promPort)
    }
  

    return (
        <div>
            <p>hello</p>
        </div>
    )
}

export default PartitionForm;


function ClusterForm() {

  const status = useSelector(state => state.clusterForm.status)


  // Creating local state for input data
  const [localForm, setLocalForm] = useState({
    clusterName: '',
    promPort: '',
    interval: ''
  });

  const dispatch = useDispatch();

  // event handler that updates the localForm based on what inputs are put in
  // Example: This it the input from the form div vor the ClusterName input bar
  // name='ClusterName'
  // value={localForm.ClusterName}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // when the form is submitted, state is dispatched from the localForm to the redux store using setClusterForm
  // *We still need to create a clusterFormService to get data from the API

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setClusterForm(localForm));
    dispatch(checkPort(localForm));
    console.log(localForm.clusterName, localForm.promPort, localForm.interval)
  }




  return (
    <>
      <div className='FormContainer'>
        <section className="form">
          <form onSubmit={handleSubmit}>
          <div className='form-group'>
              {status === 'off' ? (
              <input
                type='text'
                className='form-control'
                id='clusterName'
                name='clusterName'
                value={localForm.clusterName}
                onChange={handleInputChange}
                placeholder='Enter your ClusterName'
              />) : (
                // <div> {localForm.clusterName} </div>
                // just a place holder right now. need to style as well
                <p>Cluster Name</p>
              )}
          </div>
          <div className='form-group'>
            {status === 'off' ? (
              <input
              type='text'
              className='form-control'
              id='promPort'
              name='promPort'
              value={localForm.promPort}
              onChange={handleInputChange}
              placeholder='Port'
              /> ) : (
          // <div> {localForm.clusterName} </div>
          // just a place holder right now. need to style as well
            <p>Port Number</p>
              )}
          </div>
          <div className='form-group'>
            <select name='interval' id='selectInterval' onChange={handleInputChange}>
              <option value='null'>Select Your Interval</option>
              <option value='1'>1</option>
              <option value='3'>3</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
            </select>
          </div>

            <div className="form-group" id="buttons">
              {status === 'off' ? (
                <button type='submit' className='btn btn-block'>Submit</button>
               ) : (
                <>
                <button type='submit' className='btn btn-block'>Submit</button>
                <button type='stop' className='btn-stop'>Stop</button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

// export default ClusterForm;