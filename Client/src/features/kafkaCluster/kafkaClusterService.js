const API_URL = 'http://localhost:3000/';



/**
 * * We want to do an initial fetch request for KafkaCluster Data here
 * @returns Initial data from a get request to the server
 */
export const initialFetch = async () => {
    const response = await fetch(API_URL , {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Broker data');
    }
    const data = await response.json();

    return data;
}

const kafkaClusterService = {
    initialFetch
};

export default kafkaClusterService;