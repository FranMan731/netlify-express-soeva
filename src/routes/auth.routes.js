const express = require('express');
const AuthController = require("../controllers/auth.controller");
const AuthMiddleware = require('../middlewares/auth');

const api = express.Router();

api.post('/registrar', AuthController.registrar);
api.post('/login', AuthController.login);
api.post('/logout', AuthController.logout);
api.get('/access-token', AuthMiddleware.ensureAuth, AuthController.loginWithAccessToken);

module.exports = api;