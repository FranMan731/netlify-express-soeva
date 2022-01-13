const debug = require("debug")("server");
const routes = require('./routes');
const express = require("express");
const path = require('path');
const serverless = require('serverless-http');
const cors = require("cors");

// Set up express
debug("starting app");
const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.raw({limit: "80mb"}));

app.use(cors());

//app.use('/api', routes);
app.use('/.netlify/functions/api', routes);


module.exports = app;
module.exports.handler = serverless(app);