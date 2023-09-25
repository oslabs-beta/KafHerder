const fetch = require('node-fetch'); // for some reason we need to do npm install node-fetch@2
const axios = require('axios');

const promController = {}

promController.getMetrics = async (req, res, next) => {
    try {        
        console.log('about to make request');

        const response = await axios.get('http://localhost:9090/api/v1/label/__name__/values');
        console.log('this is the data: ', response.data.data);
        res.locals.metrics = response.data.data;

        // const response = await fetch('http://localhost:9090/api/v1/label/__name__/values'); //('http://localhost:9090/api/v1/query?query={__name__!=""}');
        // console.log('retrieved data of type: ', typeof (response));
        // console.log(response);
        // console.log(response.data);
        // const metrics = await JSON.stringify(response); //response.json();

        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = promController;