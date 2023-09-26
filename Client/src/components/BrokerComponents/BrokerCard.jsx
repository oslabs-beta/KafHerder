import React, { useState } from 'react';
import DoughnutChart from './DoughnutChart';
/**
 * TODO: Figure out what data to show in BrokerCard
 * TODO: Give it funtionality where we can click on and get a modal
 * 
 */


/**
 * This is the data inside the modal.
 * ?Do we need to make a new component for the modal or is it okay to have it in the BrokerCard component since its same data
 */
const DialogTitle = () => <h2>Your Title Here</h2>;
const DialogContent = () => {
    return(
        <>
            <h2>Broker Uptime</h2>
            <h2>Log Size</h2>
            <h2>In/Out Traffic</h2>
            <h2>Under-Replicated Partitions for the Broker</h2>
            <h2>Leader Election Rate</h2>
            <h2>Replica Lag</h2>
            <h2>System Metrics</h2>
            <h2>Log Fluish Rate and Time</h2>
            <h2>Errors</h2>
        </>
    )
}

// modal variable that makes it so we can add the modal into the click
/**
 * * Creates a modal that has an onclick in span 
 *  Once the span is clicked, closeModal function will be executed (closeModal prop passed through)
 *  closeModal={() => setModal(false)} sets the state to false so it hides modal
 */
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
/**
 * * data is propped down from BrokerContainer
 * We create local state to show if modal is shown or hidden
 * The initial state is set to false so the modal doesnt show
 * When the BrokerCard is clicked, it sets the showModal from False to True ( <!showModal> inverts the state that it is in now )
 * 
 * {showModal && <div className="modal-overlay" onClick={() => setModal(false)}></div>} : Renders a modal overlay when showModal is true
 * modal-overlay darkens the background and has an onclick to change state so you can exit the modal by clicking outside the actual modal
 * showModal && is shorthand for if showModal is true, render the right side of the &&, if false, skip the right side
 * 
 * {showModal && <Modal closeModal={() => setModal(false)} />} : shows the actual modal white box. it passes in a closeModal function to the modal prop
 * We use the modal prop for the onclick on the span element
 * Todo: probably need to have data propped down to the modal because current items are hardcoded. 
 */
function BrokerCard({ data }) {
    const [showModal, setModal] = useState(false);
    
    return (
        <>
            <div className='BrokerCard' onClick={() => setModal(!showModal)}>
                <h1>Broker #{data.BrokerId}</h1>
                <DoughnutChart chartData={data}/>
                <div> Broker ID: {data.BrokerId} </div>
                <div> Active Controller Count: {data.ActiveControllerCount} </div>
                <div> Partition Count: {data.TotalPartitionCount} </div>
                <div> % of Partitions Up: {((data.OnlinePartitions / data.TotalPartitionCount) * 100).toFixed(2)}% </div>
            </div>
            {showModal && <div className="modal-overlay" onClick={() => setModal(false)}></div>}
            {showModal && <Modal closeModal={() => setModal(false)} />} 
        </>

    )
}


export default BrokerCard