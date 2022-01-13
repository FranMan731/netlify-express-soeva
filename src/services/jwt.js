'use strict'

const jwt = require('jsonwebtoken');
const moment = require('moment');

const secret = process.env.SECRET_TOKEN;

exports.createToken = function(usuario) {
	const payload = {
		sub: usuario._id,
		nombre: usuario.nombre,
		email: usuario.email,
		celular: usuario.celular,
		imagen: usuario.imagen,
		rol: usuario.rol,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix()
	};

	return jwt.sign(payload, secret);
};

exports.validateToken = function(access_token) {
	try {
		const payload = jwt.verify(access_token, secret);

		if(payload.exp <= moment().unix()) {
			return {
				status: false,
				type: "invalid-token",
				message: "El token ha expirado"
			};
		}

		return {
			status: true,
			user: payload
		};
	} catch(e) {
		return {
			status: false,
			type: "invalid-token",
			message: "El token no es válido"
		};
	}
}