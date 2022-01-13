'use strict'

const Usuario = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

function registrar(req, res) {
    const params = req.body.data;
    const usuario = new Usuario();
    const saltRounds = 10;

    try {
        if(params.nombre && params.email && params.password) {
            usuario.nombre = params.nombre;
            usuario.email = params.email;
            usuario.rol = params.rol;
            usuario.logged = new Date();
            usuario.online = true;
            usuario.created = new Date();       

            Usuario.find({ $or: [
                    {email: usuario.email.toLowerCase()}
                ]}).exec(async (err, usuarios) => {
                    if(err) res.status(500).send({status: false, type: "server-error", message: "Hubo un error en el servidor, por favor, intente luego."});

                    if(usuarios && usuarios.length >= 1) {
						return res.status(200).send({status: false, type: "user-exists", message: "El email ya ha sido usado para otra cuenta."})
					} else {
                        usuario.password = await bcrypt.hash(params.password, saltRounds);

                        usuario.save((err, usuarioStored) => {
                        if(err) return res.status(500).send({status: false, type:"server-error", message: "Hubo un error en el servidor, no se pudo registrar el usuario."});

                            if(usuarioStored) {
                                usuarioStored.password = undefined;

                                return res.status(200).send({
                                    id: usuarioStored._id,
                                    access_token: jwt.createToken(usuarioStored),
                                    user: usuarioStored,
                                    status: true
                                });
                            } else {
                                return res.status(404).send({status: false, type:"server-error", message: "El usuario no pudo ser registrado."});
                            }
                        });
                    }
                })

        } else {
            return res.status(200).send({
                status: false,
                message: "Por favor, enviar todos los campos para registrarse.",
                type:"no-fields"
            })
        }
    } catch (error) {
        console.log('Error', error);

        return res.status(500).send({
            status: false,
            message: "Hubo un error en el servidor, por favor, intente luego.",
            type: "server-error",
        })
    }
}

function login(req, res) {
    try {
        const params = req.body.data;
        const email = params.email;
        const password = params.password;

        Usuario.findOne({email: email}, async (err, usuario) => {
            if(err) res.status(500).send({status: false, type: "server-error", message: "Hubo un error en el servidor, por favor, intente luego."});

            if(usuario) {
                const check = await bcrypt.compare(password, usuario.password);
                
                if(check) {
                    usuario.password = undefined;
                    usuario.updateOne({ $set: {logged: new Date(), online: true}}).exec();

                    return res.status(200).send({
                        access_token: jwt.createToken(usuario),
                        user: usuario,
                        status: true
                    });                     
                } else {
                    return res.status(200).send({status: false, message: "Los datos ingresados son incorrectos."});
                }
            } else {
                return res.status(200).send({status: false, type: "no-user",message: "No se ha encontrado un usuario registrado con ese email."});
            }
        });
    } catch (error) {
        console.log('Error', error);

        return res.status(500).send({
            status: false,
            message: "Hubo un error en el servidor, por favor, intente luego.",
            type: "server-error",
        })
    }
}

function logout(req, res) {
	var usuarioId = req.params.id;

	if(usuarioId === req.usuario.sub) {
		Usuario.findByIdAndUpdate(usuarioId, {online: false, logout: true}, {new: true}, (err, usuarioUpdated) => {
			if(err) return res.status(500).send({status: false});

			if(!usuarioUpdated || usuarioUpdated.length == 0) return res.status(200).send({status: true});

			usuarioUpdated.password = undefined;
			return res.status(200).send({status: true});
		})
	}
}

async function loginWithAccessToken(req, res) {
    const id = req.usuario.sub;

    try {
        Usuario.findById(id, async (err, user) => {
            if(err) return reject({status: false, type: "server-error", message: "Hubo un error en el servidor, por favor, intente luego."});
    
            if(user) {
                user.password = undefined;
                user.updateOne({ $set: {logged: new Date(), online: true}}).exec();
                user.rol = user.rol;
    
                return res.status(200).send({
                    status: true,
                    access_token: jwt.createToken(user),
                    user
                });
            } else {
                return res.status(200).send({
                    status: false,
                    type: "no-user",
                    message: "No se ha encontrado un usuario registrado con ese email."
                })
            }
        });
    } catch (error) {
        console.log('Error', error);

        return res.status(500).send({
            status: false,
            message: "Hubo un error en el servidor, por favor, intente luego.",
            type: "server-error",
        })
    }
    
}


module.exports = {
    registrar,
    login,
    logout,
    loginWithAccessToken
}