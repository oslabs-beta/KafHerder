const express = require('express');

const promController = require('./controllers/promController.js');


const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', promController.getGeneralMetrics, promController.getBrokerMetrics, (req, res) => {
    return res.status(200).send(res.locals.generalMetrics);
});

app.get('/:id', promController.getBrokerMetrics,(req, res) => {
    return res.status(200).send(brokerMetrics);
});

app.post('/', promController.connectPort,(req, res) => {
    return res.status(200).send('Successfully connected to port');
});

// app.get('/names', promController.getAllMetricNames, promController.getRandomMetric, (req, res, next) => {
//     return res.status(200).send(res.locals.metric);
// })


app.use((req, res) => res.status(404).send(`Oops! This isn't the right page.`))

app.use((err, req, res, next) => {
    const defaultError = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' }, 
    };
    const errorObj = Object.assign({}, defaultError, err);
    res.status(errorObj.status).send(errorObj.message);
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});


module.exports = app;