const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const events = require('./routes/event');
const auth = require('./routes/auth');
// const order = require('./routes/order')

app.use('/api/v1', events);
app.use('/api/v1',auth);
// app.use('/api/v1',order);
module.exports = app