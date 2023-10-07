//partitionForm
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkKafkaPort, setKafkaPort } from '../../features/clusterform/clusterFormSlice'

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
                placeholder='Input Kafka Port'
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
