var express = require('express');
const { Int32 } = require('mongodb');
var router = express.Router();
var {client, dbName} = require('../db/mongo');

/* Buscar datos Consulta Básica. */
router.get('/', function(req, res, next) {
    indexDatos()
    .then((data) => {
            res.render('consultas_basicas',{datos: data});
    })
    .catch((err) => {
        res.status(304);
        console.log(err);
        res.end();
    }); 
});

async function indexDatos(){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    let datos = await collection.find().toArray();
    return datos;
}

router.get('/:nombre', function(req, res, next) {
    buscarDatos(req.params.nombre)
    .then((data) => {
        res.render('consultas_basicas',{datos: data});
    })
    .catch((err) => {
        res.status(401);
        console.log(err);
        res.end();
    });
});

async function buscarDatos(nom){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    let datos = await collection.find({nombre: nom}).toArray();
    return datos;
}

// Insertar Datos Consulta Básica
router.post('/insertar', function(req, res, next){
    insertarDatos(req.body)
    .then(() => {
        res.redirect('/consultas');
    })
    .catch((err) => {
        res.status(401);
        console.log(err);
        res.end();
    })
});


async function insertarDatos(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    let edad = Int32(datos.edad);
    let stat = false;
    if(datos.activo !== undefined){
        stat = true;
    }
    await collection.insertOne({
        nombre: datos.nombre,
        edad: edad,
        trabajo: datos.trabajo,
        activo: stat
    });
}

router.post('/actualizar', function(req, res, next){
    actualizarDatos(req.body)
    .then(() =>{
        res.redirect('/consultas');
    })
    .catch((err) => {
        res.status(401);
        res.end();
    });
});

async function actualizarDatos(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    const filtro = {nombre:datos.nombre};
    let values;
    let edad = Int32(datos.edad);
    if(datos.activo !== undefined){
        values = { $set: {
            edad:edad, 
            trabajo:datos.trabajo, 
            activo:true}};
    }
    else{
        values = { $set: {
            edad:edad, 
            trabajo:datos.trabajo, 
            activo:false}};
    }
    
    await collection.updateOne(filtro,values);
}

module.exports = router;
