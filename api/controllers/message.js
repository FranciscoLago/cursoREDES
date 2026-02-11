'use strict';

var monment = require('moment');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el controlador de mensajes 😎'
    });
}

module.exports = {
    probando
}