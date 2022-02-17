var express = require('express');
var router = express.Router();
var {client, dbName} = require('../db/mongo');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('consultas_basicas');
});

router.post('/insertar', function(req, res, next){
    insertarDatos(req.body);
    res.redirect('/consultas');
});

async function insertarDatos(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    collection.insertOne({
        nombre: datos.nombre,
        edad: datos.edad,
        trabajo: datos.trabajo,
        activo: datos.activo
    })
}

module.exports = router;
