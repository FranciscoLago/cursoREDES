'use strict'


const followService = require('../services/followService');

async function saveFollow(req, res) {
    const params = req.body;
    try {
        const followData = {
            user: req.user.sub,
            followed: params.followed
        };
        const followStored = await followService.createFollow(followData);
        if (followStored) {
            res.status(200).send({ follow: followStored });
        } else {
            res.status(404).send({ message: 'Error al guardar el seguimiento' });
        }
    } catch {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;
    try {
        await followService.deleteFollows({ user: userId, followed: followId });
        res.status(200).send({ message: 'Follow eliminado correctamente' });
    } catch {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function getFollowingUsers(req, res) {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    let page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;
    const itemsPerPage = 6;
    try {
        const [follows, total] = await Promise.all([
            followService.getFollows({ user: userId }, page, itemsPerPage, 'followed'),
            followService.countFollows({ user: userId })
        ]);
        if (!follows || follows.length === 0) {
            return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });
        }
        const value = await followUserIds(req.user.sub);
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows: follows,
            users_following: value.following,
            users_follow_me: value.followed
        });
    } catch (err) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function followUserIds(user_id) {
    // Devuelve los ids de usuarios seguidos y seguidores
    const following = await followService.getFollows({ user: user_id });
    const followed = await followService.getFollows({ followed: user_id });
    const following_clean = following.map(f => f.followed);
    const followed_clean = followed.map(f => f.user);
    return {
        following: following_clean,
        followed: followed_clean
    };
}

async function getFollowedUsers(req, res) {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    let page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;
    const itemsPerPage = 6;
    try {
        const [follows, total] = await Promise.all([
            followService.getFollows({ followed: userId }, page, itemsPerPage, 'user'),
            followService.countFollows({ followed: userId })
        ]);
        if (!follows || follows.length === 0) {
            return res.status(404).send({ message: 'No te están siguiendo ningún usuario' });
        }
        const value = await followUserIds(req.user.sub);
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows: follows,
            users_following: value.following,
            users_follow_me: value.followed
        });
    } catch {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

// Devolver listados de usuarios
async function getMyFollows(req, res) {
    const userId = req.user.sub;
    try {
        const follows = await followService.getFollows({ user: userId });
        if (!follows || follows.length === 0) {
            return res.status(404).send({ message: 'No sigues a ningun usuario' });
        }
        return res.status(200).send({ follows });
    } catch {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}



async function getFollowBacks(req, res) {
    const userId = req.user.sub;
    try {
        const following = await followService.getFollows({ user: userId });
        if (!following || following.length === 0) {
            return res.status(200).send({ followBacks: [] });
        }
        const followedIds = following.map(item => item.followed);
        const followBacks = await followService.getFollows({ user: { $in: followedIds }, followed: userId });
        if (!followBacks) {
            return res.status(200).send({ followBacks: [] });
        }
        return res.status(200).send({ followBacks });
    } catch {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}



module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows,
    getFollowBacks
}
