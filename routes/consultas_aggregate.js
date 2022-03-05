var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var {client, dbName} = require('../db/mongo');

//Muestra todos los usuarios
router.get('/', function (req, res, next) {
    allData()
        .then((dato)=>{
            res.render('consultas_aggregate', { datos: dato });
        })  
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            client.close
        })
});

async function allData(){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemploAggregate");
    const datos = await collection.aggregate([{$match:{}}]).toArray();
    return datos;
}

//Busca usuarios
router.get('/buscar/:email', function(req, res, next){
    buscarData(req.params.email)
        .then((elemento)=>{
            res.send(elemento);
        })
        .catch((err)=>{
            res.send(err);
        })
        .finally(()=>{
            client.close
        })
});


async function buscarData(correo){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    const datos = await collection.aggregate([
        {
            $match:{email: correo}
        }
    ]).toArray()
    return datos;
}

//Inserta usuarios
router.post('/insertar', function(req, res, next){
    insertarData(req.body);
    res.redirect('/consultasA');
});

async function insertarData(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    const valida = collection.aggregate([
        {
            $match: {email: datos.email},
            $limit: 1
        }
    ]);
    if (!valida) {
        console.log('EL correo ya existe');
    }else{
        await collection.insertOne({
            nombre: datos.nombre,
            edad: datos.edad,
            trabajo: datos.trabajo,
            email: datos.email,
            password: datos.password,
            activo: datos.activo
        });
    }
}

//Edita usuarios
router.post('/actualizar', function(req, res, next){
    console.log(req.body);
    actualizarData(req.body);
    res.redirect('/consultasA');
});

async function actualizarData(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    if(datos.activo !== undefined){
        values = {
            edad:datos.edad, 
            trabajo:datos.trabajo, 
            activo:true
        }
    }
    else{
        values = {
            nombre: datos.nombre,
            edad: datos.edad,
            trabajo: datos.trabajo,
            email: datos.email,
            password: datos.password,
            activo: false
        }
    }
    await collection.aggregate([
        {
            $match:{_id: `ObjectId(${datos._id})`},
        },
        {
            $set: values
        }
    ]);
};

module.exports = router;
