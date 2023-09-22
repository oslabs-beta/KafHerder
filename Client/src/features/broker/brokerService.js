// API calls to server


/**
 * TODO: add in server route in fetch
 * @returns Fetched data from API 
 */
const fetchBrokerDataFromAPI = async () => {
    const response = await fetch('/* Add In Server Route */' , {
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