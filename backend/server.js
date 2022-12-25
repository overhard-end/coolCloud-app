require('dotenv').config();
const express = require('express');
const app = express();
const port = 4000;
var cors = require('cors');
const router = require('./router/router');
const mongoose = require('mongoose');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', router);

mongoose.set('strictQuery', false);

async function start() {
  try {
    mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME }, () =>
      console.log('db connection established'),
    );
    mongoose.connection.on('error', (err) => console.log(err));
    mongoose.connection.on('disconnected', (err) =>
      console.log('mongoose connection disconnected'),
    );

    app.listen(port, () => console.log('Server has been started on port:', port));
  } catch (error) {
    console.log(error);
  }
}
start();
