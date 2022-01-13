'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    email: String,
	password: String,
	nombre: String,

    rol: {type: String, enum: ['user', 'staff', 'admin'], default: 'user'},

    token: String,
    logged: String,
    logout: Boolean,
    online: Boolean,

    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('User', UserSchema);