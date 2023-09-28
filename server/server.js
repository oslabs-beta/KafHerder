const express = require('express');
const cors = require('cors');

const promController = require('./controllers/promController.js');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', promController.getAllMetrics, (req, res, next) => {
    return res.status(200).send(res.locals.allMetrics);
})

app.get('/names', promController.getAllMetricNames, promController.getRandomMetric, (req, res, next) => {
    return res.status(200).send(res.locals.metric);
})


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