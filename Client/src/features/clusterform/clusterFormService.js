const API_URL = 'http://localhost:3000/';


/**
 * Checks to see if the port that was submitted connects to Prometheus
 * Would need backend to use the sent port number to connect to Prometheus and send back a response of either yes or no 
 */
export const checkPromPortFromAPI = async (clusterPortData) => {
    try {
        const { promPort } = clusterPortData
        console.log('checkPromPortFromAPI', promPort)
        const response = await fetch(API_URL + 'prometheus/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ promPort })
        });

        const data = await response;

    } catch (error) {
        console.error('Error occurred in clusterFormService.js', error);
    }
};

/**
 * Checks to see if the port that was submitted connects to kafka
 * Upon successful connection, response will include cluster topic names
 */
export const checkKafkaPortFromAPI = async (clusterPortData) => {
    try {
        const { kafkaPort } = clusterPortData
        const response = await fetch(API_URL + 'admin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seedBrokerUrl: kafkaPort })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error occurred in clusterFormService.js', error);
    }
};

/**
 * Connects to kafka port, and sends topic selected by user to server
 * Response includes topic info - partitions, mininum number of partitions required, offset data
 */
export const fetchPartitionDataFromAPI = async (state) => {
    try {
        const kafkaPortUrl = state.clusterForm.kafkaPort;
        const topic = state.clusterForm.selectedTopic;

        console.log('inside fetch partition data')
        console.log('selected Topic', topic)
        const response = await fetch(API_URL + 'admin/minPartitions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seedBrokerUrl: kafkaPortUrl, topicName: topic })
        });

        const data = await response.json();
        console.log('data', data)
        return data;

    } catch (error) {
        console.error('Error occurred in clusterFormService.js', error);
    }
};

/**
 * Connects to kafka port, and sends new topic name, new partition number, new replication factor
 * This will trigger repartition process
 */
export const fetchRepartitionDataToAPI = async (state) => {
    try {
        const kafkaPortUrl = state.clusterForm.kafkaPort;
        const topic = state.clusterForm.selectedTopic;
        const newTopic = state.clusterForm.newTopic;
        const newMinPartitionNum = state.clusterForm.newMinPartitionNum;
        const newReplicationFactor = state.clusterForm.newReplicationFactor;

        const response = await fetch(API_URL + 'admin/repartition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                seedBrokerUrl: kafkaPortUrl,
                topicName: topic,
                newTopicName: newTopic,
                newMinPartitionNumber: newMinPartitionNum,
                newReplicationFactorNumber: newReplicationFactor
            })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error occurred in clusterFormService.js', error);
    }
};

const clusterFormService = {
    checkPromPortFromAPI,
    checkKafkaPortFromAPI,
    fetchPartitionDataFromAPI,
    fetchRepartitionDataToAPI
};


export default clusterFormService;

