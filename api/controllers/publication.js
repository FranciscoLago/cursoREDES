'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');


const publicationService = require('../services/publicationService');
const User = require('../models/user');
const Follow = require('../models/follow');

function probando(req, res) {
    return res.status(200).send({
        message: 'Hola mundo desde el controlador de publicaciones 😎'
    });
}

async function savePublication(req, res) {
    const params = req.body;
    if (!params.text) return res.status(200).send({ message: 'Debes enviar un texto' });
    const publicationData = {
        text: params.text,
        file: 'null',
        created_at: moment().unix(),
        user: req.user.sub
    };
    try {
        const publicationStored = await publicationService.createPublication(publicationData);
        if (!publicationStored) return res.status(404).send({ message: 'No se ha guardado la publicacion' });
        return res.status(200).send({ publication: publicationStored });
    } catch {
        return res.status(500).send({ message: 'Error en el servidor' });
    }
}

//recoge el id hace un find y busca las publicaciones del user . las devuelve
async function getPublications(req, res) {
    let page = 1;
    if (req.params.page) {
        page = parseInt(req.params.page, 10);
    }
    const itemsPerPage = 4;
    try {
        // Obtener TODOS los follows del usuario logueado
        const follows = await Follow.find({ user: req.user.sub }).populate('followed').exec();
        const follows_clean = follows.map(follow => follow.followed);
        follows_clean.push(req.user.sub);
        const [publications, total] = await Promise.all([
            publicationService.getPublications({ user: { "$in": follows_clean } }, page, itemsPerPage, '-created_at'),
            publicationService.countPublications({ user: { "$in": follows_clean } })
        ]);
        return res.status(200).send({
            total_items: total,
            pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
            page: page,
            items_per_page: itemsPerPage,
            publications: publications || []
        });
    } catch {
        return res.status(500).send({ message: 'Error al devolver las publicaciones' });
    }
}

// ...existing code...

async function getPublication(req, res) {
    const publicationId = req.params.id;
    try {
        const publication = await publicationService.getPublicationById(publicationId);
        if (!publication) return res.status(404).send({ message: 'No existe la publicación' });
        return res.status(200).send({ publication });
    } catch {
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

async function deletePublication(req, res) {
    const publicationId = req.params.id;
    try {
        // Solo puede borrar si es el dueño
        const publicationRemoved = await publicationService.deletePublication({ user: req.user.sub, _id: publicationId });
        if (!publicationRemoved) return res.status(404).send({ message: 'No se ha borrado la publicación' });
        return res.status(200).send({
            message: 'Publicación borrada satisfactoriamente',
            publication: publicationRemoved
        });
    } catch {
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

//subir archivo de imagen/avatar de usuario
async function uploadImage(req, res) {
    const publicationId = req.params.id;
    if (!req.files || !req.files.image) {
        return res.status(400).send({ message: 'No se ha subido imagen' });
    }
    const file_path = req.files.image.path;
    const file_split = file_path.split('\\');
    const file_name = file_split[file_split.length - 1];
    const ext_split = file_name.split('.');
    const file_ext = ext_split[ext_split.length - 1];
    if (['png', 'jpg', 'jpeg', 'gif'].includes(file_ext)) {
        try {
            // Solo puede actualizar si es el dueño
            const publication = await publicationService.getPublications({ user: req.user.sub, _id: publicationId });
            if (!publication || publication.length === 0) {
                return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación');
            }
            const publicationUpdated = await publicationService.updatePublication(publicationId, { file: file_name });
            if (!publicationUpdated) {
                return res.status(404).send({ message: 'No se ha podido actualizar la publicación' });
            }
            return res.status(200).send({ publication: publicationUpdated });
        } catch {
            return res.status(500).send({ message: 'Error en la peticion' });
        }
    } else {
        return removeFilesOfUploads(res, file_path, 'Extension no valida');
    }
}

function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const filePath = path.resolve('./uploads/publications/', imageFile);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ message: 'La imagen no existe' });
        }

        return res.sendFile(filePath);
    });
}
async function getPublicationsUser(req, res) {
    let page = 1;
    if (req.params.page) {
        page = parseInt(req.params.page, 10);
    }
    const itemsPerPage = 4;
    const userId = req.params.user || req.params.id;
    if (!userId) {
        return res.status(400).send({ message: 'Falta el id del usuario' });
    }
    try {
        const [publications, total] = await Promise.all([
            publicationService.getPublications({ user: userId }, page, itemsPerPage, '-created_at'),
            publicationService.countPublications({ user: userId })
        ]);
        return res.status(200).send({
            total_items: total,
            pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
            page: page,
            items_per_page: itemsPerPage,
            publications: publications || []
        });
    } catch {
        return res.status(500).send({ message: 'Error al devolver las publicaciones' });
    }
}



module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    // Exportar la función correcta
    getPublicationsUser
}