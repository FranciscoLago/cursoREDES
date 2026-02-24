'use strict';


const moment = require('moment');
const messageService = require('../services/messageService');

function probando(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el controlador de mensajes 😎'
    });
}

async function saveMessage(req, res) {
    const params = req.body;
    if (!params || !params.text || !params.receiver) {
        return res.status(200).send({ message: 'Envia los datos necesarios' });
    }
    try {
        const messageData = {
            emitter: req.user.sub,
            receiver: params.receiver,
            text: params.text,
            created_at: moment().unix(),
            viewed: 'false'
        };
        const messageStored = await messageService.createMessage(messageData);
        if (!messageStored) return res.status(404).send({ message: 'Error al enviar el mensaje' });
        return res.status(200).send({ message: messageStored });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function getReceivedMessages(req, res) {
    const userId = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 4;
    try {
        const [messages, total] = await Promise.all([
            messageService.getMessages({ receiver: userId }, page, itemsPerPage, '-created_at'),
            messageService.countMessages({ receiver: userId })
        ]);
        if (!messages || messages.length === 0) return res.status(404).send({ message: 'No tienes mensajes' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            messages
        });
    } catch {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function getEmmitMessages(req, res) {
    const userId = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 4;
    try {
        const [messages, total] = await Promise.all([
            messageService.getMessages({ emitter: userId }, page, itemsPerPage, '-created_at'),
            messageService.countMessages({ emitter: userId })
        ]);
        if (!messages || messages.length === 0) return res.status(404).send({ message: 'No tienes mensajes' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            messages
        });
    } catch {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function getUnviewedMessages(req, res) {
    const userId = req.user.sub;
    try {
        const messages = await messageService.getMessages({ receiver: userId, viewed: 'false' });
        if (!messages) return res.status(404).send({ message: 'No tienes mensajes' });
        return res.status(200).send({ 'unviewed': messages.length });
    } catch {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function setViewedMessages(req, res) {
    const userId = req.user.sub;
    try {
        const messagesUpdated = await messageService.updateMessages({ receiver: userId, viewed: 'false' }, { viewed: 'true' });
        return res.status(200).send({ messages: messagesUpdated });
    } catch {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}