'use strict'

var express = require('express'); // Carga el modulo de express para poder crear rutas y servicios
var FollowController = require('../controllers/follow'); // Carga el controlador de follow
var api = express.Router(); // Crea el router de express para configurar las rutas
var md_auth = require('../middlewares/authenticated'); // Carga el middleware de autenticacion

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow); 
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id/:page', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id/:page', md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed', md_auth.ensureAuth, FollowController.getMyFollows);
api.get('/get-follow-backs', md_auth.ensureAuth, FollowController.getFollowBacks);


module.exports = api; // Exporta la configuracion de las rutas