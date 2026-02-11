'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
var mongoUri = process.env.MONGODB_URI ||
    'mongodb+srv://francisco:admin@cluster0.0iazbgo.mongodb.net/curso_mean_social?retryWrites=true&w=majority';

    // Conexión a la base de datos
mongoose.connect(mongoUri)
    .then(() => {
        console.log("Conexión a la base de datos curso_mean_social se ha realizado correctamente");

        // Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:" + port);
        });
    })
    .catch(err => console.log(err));