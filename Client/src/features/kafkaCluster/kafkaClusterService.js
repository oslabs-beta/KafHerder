const API_URL = 'http://localhost:3000/';



/**
 * * We want to do an initial fetch request for KafkaCluster Data here
 * @returns Initial data from a get request to the server
 */

export const fetchClusterDataFromAPI = async (state) => {
    // we want to take in state here and pass it into the param
    // we set a port variable and set it equal to state.clusterForm.port
    const port = state.clusterForm.promPort;

    try {
        const response = await fetch(`${API_URL}?port=${port}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Broker data');
        }
        const data = await response.json();
        console.log(data)

        return data;
    } catch (error) {
        console.error(`Error occurred when fetching data from ${port}`)
    }
}

const kafkaClusterService = {
    fetchClusterDataFromAPI
};

export default kafkaClusterService;