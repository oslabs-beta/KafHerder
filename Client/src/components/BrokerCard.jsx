import React, { useState } from 'react';

/**
 * TODO: Figure out what data to show in BrokerCard
 * TODO: Give it funtionality where we can click on and get a modal
 * 
 */

// data for the modal
// probably should make another component for it and have live data streamed into it
const DialogTitle = () => <h2>Your Title Here</h2>;
const DialogContent = () => <h2>Your Content Here</h2>

    // modal variable that makes it so we can add the modal into the click
    const Modal = ({ closeModal }) => {
        return (
            <div className="modal">
                <span className="modal-close" onClick={closeModal}>&times;</span>
                <DialogTitle />
                <DialogContent />
            </div>
        );
    };

// set a modal with state inside. Might want to play with it to have it more modular?
function BrokerCard({ data }) {
    const [showModal, setModal] = useState(false);
      
    return (
        <>
            <div className='BrokerCard' onClick={() => setModal(!showModal)}>
                <h1>Broker #{data.BrokerId}</h1>
                <div> Broker ID: {data.BrokerId} </div>
                <div> Active Controller Count: {data.ActiveControllerCount} </div>
                <div> Partition Count: {data.PartitionCount} </div>
            </div>
            {showModal && <div className="modal-overlay" onClick={() => setModal(false)}></div>}
            {showModal && <Modal closeModal={() => setModal(false)} />}
        </>

    )
}


export default BrokerCard