const API_URL = 'http://localhost:3000/';


/**
 * Checks to see if the port that was submitted connects to Prometheus
 * Would need backend to use the send port number to connect to Prometheus and send back a response of either yes or no
 * 
 */
export const checkPortFromAPI = async (clusterPortData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clusterPortData)
        });
    
        const data = await response;
        //*TODO: make sure this throws a 404 on backend and check for it here too
        console.log('data', data)
        // if (data.success) {
        //     return clusterPortData
        // } else {
        //     throw new Error('Failed to connect to port');
        // }    
    } catch (error) {
        console.error('Error occurred in clusterFormService.js', error);
    }
};

const clusterFormService = {
    checkPortFromAPI
};

export default clusterFormService;