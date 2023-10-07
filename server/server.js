const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const adminRouter = require('./routes/admin.js');
const promRouter = require('./routes/prom.js');
const rpRouter = require('./routes/rp.js');

app.use(cors());
app.use(express.json());

app.use('/prometheus', promRouter);
app.use('/admin', adminRouter);
app.use('/rp', rpRouter);


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