require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

const initRoutes_v1 = require('./express/v1/routes');

app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('combined'));

initRoutes_v1(app); // Setup version 1 routes

app.listen(process.env.EXPRESS_PORT || 5001, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Service listening on port ${process.env.EXPRESS_PORT}...`);
  }
});
