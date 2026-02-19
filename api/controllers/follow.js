'use strict'

var path = require('path');
var fs = require('fs'); // modulo de node para trabajar con archivos
var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub; // obtenemos el id del usuario logueado a traves del token
    follow.followed = params.followed; // obtenemos el id del usuario a seguir

    follow.save()
        .then((followStored) => {
            if (followStored) {
                res.status(200).send({ follow: followStored });
            } else {
                res.status(404).send({ message: 'Error al guardar el seguimiento' });
            }
        })
        .catch(() => {
            res.status(500).send({ message: 'Error en el servidor' });
        });
}

function deleteFollow(req, res) {
    var userId = req.user.sub; // obtenemos el id del usuario logueado a traves del token
    var followId = req.params.id; // obtenemos el id del usuario a dejar de seguir

    Follow.deleteOne({ user: userId, followed: followId })
        .then(() => {
            res.status(200).send({ message: 'Follow eliminado correctamente' });
        })
        .catch(() => {
            res.status(500).send({ message: 'Error en el servidor' });
        });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub; // obtenemos el id del usuario logueado a traves del token
    if (req.params.id) {
        userId = req.params.id;
    }

    var page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;

    var itemsPerPage = 6;

    Promise.all([
        Follow.find({ user: userId })
            .populate({ path: 'followed' })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec(),
        Follow.countDocuments({ user: userId }).exec()
    ])
        .then(([follows, total]) => {
            // console.log('DEBUG follows:', follows);
            if (!follows || follows.length === 0) {
                return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });
            }

            followUserIds(req.user.sub).then((value) => {
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows: follows,
                    users_following: value.following,
                    users_follow_me: value.followed
                });
            });
        })
        .catch((err) => {
            console.error('DEBUG error:', err);
            res.status(500).send({ message: 'Error en el servidor' });
        });
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

function getFollowedUsers(req, res) {

    var userId = req.user.sub; // obtenemos el id del usuario logueado a traves del token
    if (req.params.id) {
        userId = req.params.id;
    }

    var page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;

    var itemsPerPage = 6;

    Promise.all([
        Follow.find({ followed: userId })
            .populate({ path: 'user' })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec(),
        Follow.countDocuments({ followed: userId }).exec()
    ])
        .then(([follows, total]) => {
            if (!follows || follows.length === 0) {
                return res.status(404).send({ message: 'No te están siguiendo ningún usuario' });
            }

            followUserIds(req.user.sub).then((value) => {
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows: follows,
                    users_following: value.following,
                    users_follow_me: value.followed
                });
            });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}

// Devolver listados de usuarios
function getMyFollows(req, res) {
    var userId = req.user.sub;
    Follow.find({ user: userId })
        .populate('followed')
        .exec()
        .then((follows) => {
            if (!follows || follows.length === 0) {
                return res.status(404).send({ message: 'No sigues a ningun usuario' });
            }
            return res.status(200).send({ follows });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}



function getFollowBacks(req, res) {
    var userId = req.user.sub;

    Follow.find({ user: userId }).select('followed').exec()
        .then((following) => {
            if (!following || following.length === 0) {
                return res.status(200).send({ followBacks: [] });
            }

            var followedIds = following.map((item) => item.followed);

            return Follow.find({ user: { $in: followedIds }, followed: userId })
                .select('user')
                .exec();
        })
        .then((followBacks) => {
            if (!followBacks) {
                return res.status(200).send({ followBacks: [] });
            }

            return res.status(200).send({ followBacks: followBacks });
        })
        .catch(() => res.status(500).send({ message: 'Error en el servidor' }));
}



module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows,
    getFollowBacks
}
