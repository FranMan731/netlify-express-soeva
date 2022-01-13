'use strict'
require('./config/config.js');
var mongoose = require('mongoose');
var app = require('./src/App');

//Conexión a base de datos
mongoose.Promise = global.Promise;
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("La conexión se ha realizado con éxito.");

		//Crea el servidor
		app.listen(process.env.PORT, () => {
			console.log("Servidor corriendo en http://localhost:5000/.netlify/functions/api");
		});
	})
	.catch(err => console.log(err));