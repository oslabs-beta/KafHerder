import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setClusterForm, checkPort } from '../features/clusterform/clusterFormSlice'



function ClusterForm() {


  // Creatinng local state for input data
  const [localForm, setLocalForm] = useState({
    clusterName: '',
    port: '',
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
    console.log(localForm.clusterName, localForm.port, localForm.interval)
  }

  return (
    <>
      <div className='FormContainer'>
        <section className="form">
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                id='ClusterName'
                name='ClusterName'
                value={localForm.clusterName}
                onChange={handleInputChange}
                placeholder='Enter your ClusterName'
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                id='Port'
                name='Port'
                value={localForm.port}
                onChange={handleInputChange}
                placeholder='Port'
              />
            </div>
            <div className='form-group'>
              <select name='Interval' id='selectInterval' onChange={handleInputChange}>
                <option value='null'>Select Your Interval</option>
                <option value='1'>1</option>
                <option value='3'>3</option>
                <option value='5'>5</option>
                <option value='10'>10</option>
              </select>
            </div>

            <div className="form-group">
              <button type='submit' className='btn btn-block'>Submit</button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default ClusterForm;