import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setClusterForm } from '../features/clusterform/clusterFormSlice'

function ClusterForm() {

  const [localForm, setLocalForm] = useState({
    ClusterName: '',
    Port: ''
  });

  const dispatch = useDispatch();


  const handleInputChange = (e) => {
    const { name , value } = e.target;
    setLocalForm(prevState => ({
      ...prevState,
      [name]: value 
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setClusterForm(localForm));
    console.log(localForm.ClusterName, localForm.Port)
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
                        value={localForm.ClusterName}
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
                        value={localForm.Port}
                        onChange={handleInputChange}
                        placeholder='Port'
                    />
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

export default ClusterForm