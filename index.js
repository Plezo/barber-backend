const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const appointmentRoute = require('./routes/appointment');

app.use(bodyParser.json());
app.use('/appointment', appointmentRoute);

app.get('/', (req, res) => {
    res.send('We are on home');
});

mongoose.connect(process.env.DB_CONNECTION, (err) => {
    if (err) console.log('Not connected!');
    else console.log('Connected to db!');
});

app.listen(3000);