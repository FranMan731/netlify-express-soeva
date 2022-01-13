'use strict'

const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = process.env.SECRET_TOKEN;

exports.ensureAuth = function(req, res, next) {
	if(!req.headers.authorization) {
		return res.status(403).send({message: "La petición no tiene la cabecera de autenticación"});
	}

	let token = req.headers.authorization.replace(/['"]+/g, '');
	token = token.split(" ");
	token = token[1];

	try {
		const payload = jwt.verify(token, secret);

		if(payload.exp <= moment().unix()) {
			return res.status(401).send({
				message: "El token ha expirado"
			});
		}

		req.usuario = payload;
	} catch(e) {
		return res.status(404).send({
				message: "El token no es válido"
			});
	}

	next();
}

exports.ensureAuthAdmin = function(req, res, next) {
	if(!req.headers.authorization) {
		return res.status(403).send({message: "La petición no tiene la cabecera de autenticación"});
	}

	let token = req.headers.authorization.replace(/['"]+/g, '');
	token = token.split(" ");
	token = token[1];

	try {
		const payload = jwt.verify(token, secret);

		if(payload.exp <= moment().unix()) {
			return res.status(401).send({
				message: "El token ha expirado"
			});
		}

		if(payload.rol !== "admin") {
			return res.status(404).send({
				status: false,
				message: "No tiene los permisos necesarios."
			})
		}

		req.usuario = payload;
	} catch(e) {
		return res.status(404).send({
				message: "El token no es válido"
			});
	}

	next();
}