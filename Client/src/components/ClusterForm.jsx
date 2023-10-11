import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setClusterForm, checkPromPort, setStatusOff } from '../features/clusterform/clusterFormSlice'



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

  //* Created a dispatch to set state to off when clicked
  const handleStopClick = () => {
    dispatch(setStatusOff())
  }

  // when the form is submitted, state is dispatched from the localForm to the redux store using setClusterForm
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setClusterForm(localForm));
    dispatch(checkPromPort(localForm));
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
                <div>{localForm.clusterName}</div>
                // Need to style
                // <p>Cluster Name</p>
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
          <div> 
            <p>{localForm.promPort} </p>
          </div>
            // Need to style
            // <p>Port Number</p>
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
                <button type='submit' className='btn'>Submit</button>
               ) : (
                <>
                <button type='submit' className='btn'>Submit</button>
                <button type='button' className='btn-stop' onClick={handleStopClick}>Stop</button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default ClusterForm;