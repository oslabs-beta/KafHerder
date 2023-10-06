const API_URL = 'http://localhost:3000/';



/**
 * * We want to do an initial fetch request for KafkaCluster Data here
 * @returns Initial data from a get request to the server
 */
// TODO : set param as state and set port === state.clusterForm.port
export const initialFetch = async (state) => {
    // we want to take in state here and pass it into the param
    // we set a port variable and set it equal to state.clusterForm.port

    const port = state.clusterForm.port;
    // const { getState } = thunkAPI;
    // const state = getState();
    // const port = state.clusterForm.port
    console.log('port in initialFetch', port)
    // console.log('inside initialFetch')

    // TODO : set the fetch request to the urlapi and set the param as ?port=${port}
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
}

const kafkaClusterService = {
    initialFetch
};

export default kafkaClusterService;