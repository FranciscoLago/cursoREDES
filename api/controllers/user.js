'use strict'

var moongosePaginate = require('mongoose-pagination');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');


var User = require('../models/user');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
const { count } = require('console');
const user = require('../models/user');


// metodos de prueba
function home(req, res) {
    res.status(200).send({ message: 'Hola mundo desde el servidor de NodeJS' });
};


function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({ message: 'Accion de pruebas del servidor de NodeJS' });
};
// Registrar un nuevo usuario
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;


        // Controlar si el usuario ya existe
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec()
            .then((users) => {
                if (users && users.length >= 1) {
                    return res.status(200).send({ message: 'El usuario ya se encuentra registrado' });
                }

                // En caso que el usuario no exista, cifrar la contraseña y guardar el usuario
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    if (err) return res.status(500).send({ message: 'Error al cifrar la contrasena' });

                    user.password = hash;

                    user.save()
                        .then((userStored) => {
                            if (userStored) {
                                res.status(200).send({ user: userStored });
                            } else {
                                res.status(404).send({ message: 'No se ha registrado el usuario' });
                            }
                        })
                        .catch(() => res.status(500).send({ message: 'Error al guardar el usuario' }));
                });
            })
            .catch(() => res.status(500).send({ message: 'Error en la peticion de usuarios' }));

    } else {
        res.status(200).send({ message: 'Envia todos los campos necesarios' });
    }
};

// Login de usuario
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }).exec()
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
            }

            bcrypt.compare(password, user.password, (err, check) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (check) {
                    if (params.gettoken) {
                        // Generar y devolver el token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }

                    // Devolver los datos del usuario logueado
                    user.password = undefined;
                    return res.status(200).send({ user });
                }

                return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
            });
        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
};


// Conseguir datos de un usuario
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId).exec()
        .then((user) => {
            if (!user) return res.status(404).send({ message: 'El usuario no existe' });

            followThisUser(req.user.sub, userId).then((value) => {
                user.password = undefined;
                return res.status(200).send({
                    user,
                    following: value.following,
                    followed: value.followed
                });
            })

        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));

}

async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec()
        .then((follow) => {
            return follow;
        })
        .catch(() => { return handleError(err) });

    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec()
        .then((follow) => {
            return follow;
        })
        .catch(() => { return handleError(err) });

    return {
        following: following,
        followed: followed
    };
}

async function followUserIds(user_id) {
    var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
        .then((follows) => {
            return follows;

        })
        .catch(() => { return handleError(err) });

    var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
        .then((follows) => {
            return follows;
        })
        .catch(() => { return handleError(err) });

    //----------------------- procesar following ids

    var following_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });

    //----------------------- procesar followed ids

    var followed_clean = [];

    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });

    return {
        following: following_clean,
        followed: followed_clean
    };
}

// Devolver un listado de usuarios paginado
function getUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;

    var itemsPerPage = 6;

    Promise.all([
        User.find()
            .sort('_id')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec(),
        User.countDocuments().exec()
    ])
        .then(([users, total]) => {
            if (!users || users.length === 0) {
                return res.status(404).send({ message: 'No hay usuarios disponibles' });
            }
            followUserIds(identity_user_id).then((value) => {
                return res.status(200).send({
                    users,
                    users_following: value.following,
                    users_follow_me: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });


            });
        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
}

function getCounters(req, res) {
    var userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getCountFollows(userId).then((value) => {
        return res.status(200).send(value);
    })
}

async function getCountFollows(user_id) {
    var following = await Follow.countDocuments({ "user": user_id }).exec()
        .then((count) => {
            return count;
        })
        .catch(() => { return handleError(err) });

    var followed = await Follow.countDocuments({ "followed": user_id }).exec()
        .then((count) => {
            return count;
        })
        .catch(() => { return handleError(err) });

    var publications = await Publication.countDocuments({ "user": user_id }).exec()
        .then((count) => {
            return count;
        })
        .catch(() => { return handleError(err) });

    return {
        following: following,
        followed: followed,
        publications: publications
    };
}

// edicion de datos de usuario
function updateUser(req, res) {
    var userId = req.params.id; // URL params
    var update = req.body; //recojo el body de la request POST

    if (!update) {
        return res.status(400).send({ message: 'No hay datos para actualizar' });
    }

    delete update.password; // evito que se actualice la contrasena
    if (userId !== req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }
    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }
        ]
    }).exec()
        .then((users) => {
            // Check if another user (not the current one) already uses the email or nick.
            var user_isset = users && users.some((u) => u._id.toString() !== userId);

            if (user_isset) {
                return res.status(500).send({ message: 'Los datos ya estan en uso' });
            }

            User.findByIdAndUpdate(userId, update, { new: true }).exec()
                .then((userUpdated) => {
                    if (!userUpdated) {
                        return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    }

                    return res.status(200).send({ user: userUpdated });
                })
                .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));

}

//subir archivo de imagen/avatar de usuario
function uploadImage(req, res) {
    var userId = req.params.id;

    if (!req.files || !req.files.image) {
        return res.status(400).send({ message: 'No se ha subido imagen' });
    }

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[file_split.length - 1];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length - 1];

        if (userId !== req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar este usuario');
        }

        // nombre del archivo
        console.log(ext_split);
        //extension
        console.log(file_ext);
        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'gif') {
            // Actualizar documento de usuario logueado

            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }).exec()
                .then((userUpdated) => {
                    if (!userUpdated) {
                        return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    }
                    return res.status(200).send({ user: userUpdated });
                })
                .catch(() => {
                    return res.status(500).send({ message: 'Error en la peticion' });
                });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido archivos' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const filePath = path.resolve('./uploads/users/', imageFile);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ message: 'La imagen no existe' });
        }

        return res.sendFile(filePath);
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
};