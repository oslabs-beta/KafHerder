const API_URL = 'http://localhost:3000/';


/**
 * Checks to see if the port that was submitted connects to Prometheus
 * Would need backend to use the send port number to connect to Prometheus and send back a response of either yes or no
 * 
 */
export const checkPortFromAPI = async (clusterPortData) => {
    const response = await fetch(API_URL + 'checkPort' , {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(clusterPortData)
    });

    const data = await response.json();
    if (data.success) {
        return clusterPortData
    } else {
        throw new Error('Failed to connect to port');
    }
};

const clusterFormService = {
    checkPortFromAPI
};

export default clusterFormService;