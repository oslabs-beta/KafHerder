import React from 'react';

function KafkaCard() {
    return (
    <>
        <div className='KafkaCard'>
            <div className='graphPlaceholder'>
                <h1>Cluster Uptime</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Active Brokers</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Under Replicated Partitions</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Offline Partitions</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1># Controller</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Bytes In/Sec</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Bytes Out/Sec</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Messages In/Sec</h1>
            </div>
            <div className='graphPlaceholder'>
            <h1>Error Rate (failed produce or consume requests)</h1>
            </div>
        </div>
    </>
    )
}

export default KafkaCard;