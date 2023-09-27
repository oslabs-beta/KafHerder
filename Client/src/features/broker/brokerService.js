const API_URL = 'http://localhost:3000/';


/**
 * Initial get request if the fetchClusterDataFromAPI isnt up. 
 * fetchClusterDataFromAPI should take in the cluster name and port number to link server to broker and fetch relevant data
 * TODO We need to figure out what the URL route will be fore broker data
 */
export const fetchBrokerDataFromAPI = async () => {
    const response = await fetch(API_URL + 'brokerData', {
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

const brokerService = {
    fetchBrokerDataFromAPI
};

export default brokerService;