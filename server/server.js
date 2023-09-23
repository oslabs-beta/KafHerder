const express = require('express');

const promController = require('./controllers/promController.js');


const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', promController.getMetrics, (req, res, next) => {
    console.log(res.locals.metrics);
    res.status(200).send(res.locals.metrics);
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