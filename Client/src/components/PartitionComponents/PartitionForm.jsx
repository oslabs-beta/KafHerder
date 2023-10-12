//partitionForm
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { checkKafkaPort, setKafkaPort } from '../../features/clusterform/clusterFormSlice'

function PartitionForm() {

  // Creating local state for input data
  const [partitionForm, setPartitionForm] = useState({
    kafkaPort: '',
  });

  const dispatch = useDispatch();

  // event handler that updates the partitionForm based on what inputs are put in
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartitionForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // when the form is submitted, state is dispatched from the partitionForm to the redux store using setKafkaPort
  // handle submit also triggers post request to the server to verify port 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setKafkaPort(partitionForm));
    dispatch(checkKafkaPort(partitionForm));
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
                id='kafkaPort'
                name='kafkaPort'
                value={partitionForm.kafkaPort}
                onChange={handleInputChange}
                placeholder='Input Kafka Port (e.g. localhost:9092)'
              />
            </div>
            <div className="form-group" id="buttons">
              <button type='submit' className='btn btn-block'>Submit</button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default PartitionForm;
