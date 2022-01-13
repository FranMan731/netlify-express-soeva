'use strict'

const express = require('express');
const app = express();

//Routes
const auth_routes = require('./auth.routes');

app.use('/', auth_routes);

module.exports = app;