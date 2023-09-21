import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { setClusterName, selectClusterName } from '../features/clusterform/clusterFormSlice'

function ClusterForm() {

//   const dispatch = useDispatch();
//   const ClusterName = useSelector(selectClusterName);

//   const handleInputChange = (e) => {
//     dispatch(setClusterName(e.target.value));
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(ClusterName)
//   }

  return (
    <>
    <div className='FormContainer'>
              {/* <section className="form">
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input 
                        type='text' 
                        className='form-control' 
                        id='ClusterName'
                        name='ClusterName'
                        value={ClusterName}
                        onChange={handleInputChange}
                        placeholder='Enter your ClusterName'
                    />
                </div>

                <div className="form-group">
                    <button type='submit' className='btn btn-block'>Submit</button>
                </div>
            </form>
        </section> */}
    </div>
    </>
  )
}

export default ClusterForm