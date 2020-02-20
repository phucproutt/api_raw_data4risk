const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const index = require('./routes/index');
const getRawAlert = require('./routes/getRawAlert');

// handle mongodb url with env 
const _ = require('lodash')
const environment = _.get(process,'env.NODE_ENV','development')

let username = _.get(process,'env.DATABASE_USERNAME','netdevices')
let password = _.get(process,'env.DATABASE_PASSWORD','netdevices')
let database = _.get(process,'env.DATABASE_NAME','weather')
let host = _.get(process,'env.DATABASE_HOST','mongo')
const mongoUrl = environment === 'development' ?  'mongodb://localhost:27017/test' : `mongodb://${username}:${password}@${host}/${database}`

mongoose.set('useCreateIndex', true);

function connect ()
{
  mongoose.connect(mongoUrl, { auto_reconnect: true , useNewUrlParser: true, useUnifiedTopology: true })
  .catch(() => {});
}

const db = mongoose.connection;
const reconnectTimeout = 60000;

db.on('connecting', () => {
  console.info('Connecting to MongoDB...');
});

db.on('error', (error) => {
  console.error(`MongoDB connection error: ${error}`);
  mongoose.disconnect();
});

db.on('connected', () => {
  console.info('Connected to MongoDB!');
});

db.once('open', () => {
  console.info('MongoDB connection opened!');
});

db.on('reconnected', () => {
  console.info('MongoDB reconnected!');
});

db.on('disconnected', () => {
  console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
  setTimeout(() => connect(), reconnectTimeout);
});

connect();
mongoose.set('debug', true);

app.use(cors());

app.use('/', index);
app.use('/api', getRawAlert);

app.listen(3007, () => console.log('Example app listening on port 3007!'))
module.exports = app;