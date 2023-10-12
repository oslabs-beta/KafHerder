import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../components/NavBar'
import LeftContainer from '../container/LeftContainer'
import TopicsList from '../components/PartitionComponents/TopicsList'
import RepartitionForm from '../components/PartitionComponents/RepartitionForm'

// create a modal that will pop up once the page renders.
// modal will have a message to remind client to pause all producers and consumers
const Modal = ({ closeModal }) => {
  return (
    <div className='modalRepartitionPage'>
      {/* <span className="modal-close" onClick={closeModal}>&times;</span> */}
      <p style={{ color: 'red', fontWeight: 'bold' }}> Remember to pause all producers and consumers before creating a new topic.
        This will prevent the new topic from being created with outdated data.
      </p>
      <button className='modal-close-button' onClick={closeModal}>OK</button >
    </div>
  );
};

function Repartition() {
  const [showModal, setModal] = useState(true);

  const partitionData = useSelector(state => state.clusterForm.partitionData)
  let partitionArray = Object.keys(partitionData)
  return (
    <>
      <div className='root'>
        <NavBar />
        <div className='homeContainer'>
          <LeftContainer />
          <div className='rightContainer' style={{ minWidth: '400px' }}>
            {(partitionArray.length === 0)  ?
              <TopicsList /> :
              <RepartitionForm />}
          </div>
        </div>
        {showModal && <div className="modal-overlay" onClick={() => setModal(false)}></div>}
        {showModal && <Modal closeModal={() => setModal(false)} />}
      </div>
    </>
  )
}

export default Repartition




