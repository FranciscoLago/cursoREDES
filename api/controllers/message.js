'use strict';

var moment = require('moment');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el controlador de mensajes 😎'
    });
}

function saveMessage(req, res) {
    var params = req.body;
    if (!params || !params.text || !params.receiver) return res.status(200).send({ message: 'Envia los datos necesarios' });

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';
    message.save()
        .then((messageStored) => {
            if (!messageStored) return res.status(404).send({ message: 'Error al enviar el mensaje' });
            return res.status(200).send({ message: messageStored });
        })
        .catch((err) => {
            if (err) return res.status(500).send({ message: 'Error en el servidor' });
        })
}

function getReceivedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Promise.all([
        Message.find({ receiver: userId })
            .populate('emitter receiver', 'name surname _id nick image')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort('-created_at')
            .exec(),
        Message.countDocuments({ receiver: userId }).exec()
    ])
        .then(([messages, total]) => {
            if (!messages || messages.length === 0) return res.status(404).send({ message: 'No tienes mensajes' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                messages
            });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}

function getEmmitMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Promise.all([
        Message.find({ emitter: userId })
            .populate('emitter receiver', 'name surname _id nick image')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort('-created_at')
            .exec(),
        Message.countDocuments({ emitter: userId }).exec()
    ])
        .then(([messages, total]) => {
            if (!messages || messages.length === 0) return res.status(404).send({ message: 'No tienes mensajes' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                messages
            });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.find({ receiver: userId, viewed: 'false' })
        .exec()
        .then((messages) => {
            if (!messages) return res.status(404).send({ message: 'No tienes mensajes' });
            return res.status(200).send({ 'unviewed': messages.length });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;

    Message.updateMany({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { multi: true })
        .exec()
        .then(messagesUpdated => {
            return res.status(200).send({ messages: messagesUpdated });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}