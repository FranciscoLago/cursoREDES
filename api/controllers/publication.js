'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
    return res.status(200).send({
        message: 'Hola mundo desde el controlador de publicaciones 😎'
    });
}

function savePublication(req, res) {
    var params = req.body;
    var publication = new Publication();

    if (!params.text) return res.status(200).send({ message: 'Debes enviar un texto' });
    publication.text = params.text;
    publication.file = 'null';
    publication.created_at = moment().unix();
    publication.user = req.user.sub;

    publication.save()
        .then((publicationStored) => {
            if (!publicationStored) res.status(404).send({ message: 'No se ha guardado la publicacion' });
            return res.status(200).send({ publication: publicationStored });
        })

        .catch((err) => {
            if (err) res.status(500).send({ message: 'Error en el servidor' });

        });
}

//recoge el id hace un find y busca las publicaciones del user . las devuelve
function getPublications(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Promise.all([
        Follow.find({ user: req.user.sub })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate('followed')
            .exec(),
        Follow.countDocuments({ user: req.user.sub }).exec()
    ])
        .then(([follows]) => {
            var follows_clean = [];

            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            })

            // añadimos el propio id del usuario logueado para que también aparezcan sus publicaciones
            follows_clean.push(req.user.sub);

            return Promise.all([
                Publication.find({ user: { "$in": follows_clean } })
                    .sort('-created_at')
                    .skip((page - 1) * itemsPerPage)
                    .limit(itemsPerPage)
                    .populate('user')
                    .exec(),
                Publication.countDocuments({ user: { "$in": follows_clean } }).exec()
            ]);
        })
        .then(([publications, total]) => {
            if (!publications || publications.length === 0) return res.status(404).send({ message: 'No hay publicaciones' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                publications
            });
        })
        .catch(() => res.status(500).send({ message: 'Error al devolver las publicaciones' }));
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId)
        .then((publication) => {
            if (!publication) return res.status(404).send({ message: 'No existe la publicación' });
            return res.status(200).send({ publication });
        }).catch((err) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });

        })
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.findOneAndDelete({ user: req.user.sub, _id: publicationId })
        .then((publicationRemoved) => {
            if (!publicationRemoved) return res.status(404).send({ message: 'No se ha borrado la publicación' });

            return res.status(200).send({
                message: 'Publicación borrada satisfactoriamente',
                publication: publicationRemoved
            });
        })
        .catch(() => res.status(500).send({ message: 'Error en la petición' }));
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

//subir archivo de imagen/avatar de usuario
function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (!req.files || !req.files.image) {
        return res.status(400).send({ message: 'No se ha subido imagen' });
    }

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');  
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length - 1];


        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'gif') {

            Publication.findOne({ user: req.user.sub, _id: publicationId }).exec()
                .then((publication) => {
                    if (!publication) {
                        return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación');
                    }

                    // Actualizar documento de publicacion
                    Publication.findOneAndUpdate(
                        { user: req.user.sub, _id: publicationId },
                        { file: file_name },
                        { new: true }
                    ).exec()
                        .then((publicationUpdated) => {
                            if (!publicationUpdated) {
                                return res.status(404).send({ message: 'No se ha podido actualizar la publicación' });
                            }
                            return res.status(200).send({ publication: publicationUpdated });
                        })
                        .catch(() => {
                            return res.status(500).send({ message: 'Error en la peticion' });
                        });

                })
                .catch(() => {
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación');
                })




        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido archivos' });
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


module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}