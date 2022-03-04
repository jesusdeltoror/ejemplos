var express = require('express');
var router = express.Router();
var {client, dbName} = require('../db/mongo');

/* Buscar datos Consulta Básica. */
router.get('/', function(req, res, next) {
    indexDatos()
    .then((data) => {
            res.render('consultas_basicas',{datos: data});
    })
    .catch((err) => {
        //res.status(304).json(err);
        console.log(err);
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
        res.status(401).json(err);
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
        res.status(304).json(err);
    })
});


async function insertarDatos(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    await collection.insertOne({
        nombre: datos.nombre,
        edad: datos.edad,
        trabajo: datos.trabajo,
        activo: datos.activo
    });
}

router.put('/actualizar/:data', (res, req, next) => {
    /*actualizarDatos(req.params)
    .then(() =>{
        res.render('/consultas');
    })
    .catch((err) => {
        res.status(400).json(err);
    })*/
});

async function actualizarDatos(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    const query = {nombre:datos.nombre};
    let values;
    if(datos.hasOwnProperty('activo')){
        values = { $set: {
            edad:datos.edad, 
            trabajo:datos.trabajo, 
            activo:true}};
    }
    else{
        values = { $set: {
            edad:datos.edad, 
            trabajo:datos.trabajo, 
            activo:false}};
    }
    
    await collection.updateOne(query,values);
}

module.exports = router;
