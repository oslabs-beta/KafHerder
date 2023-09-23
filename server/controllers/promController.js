const fetch = require('node-fetch'); // for some reason we need to do npm install node-fetch@2

const promController = {}

promController.getMetrics = async (req, res, next) => {
    try {
        console.log('about to make request');
        const response = await fetch('http://localhost:9090/api/v1/label/__name__/values') //('http://localhost:9090/api/v1/query?query={__name__!=""}');
        console.log('retrieved data of type: ', typeof (response));
        const metrics = await JSON.stringify(response); //response.json();
        res.locals.metrics = metrics;
        console.log(metrics);
        return next();
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = promController;