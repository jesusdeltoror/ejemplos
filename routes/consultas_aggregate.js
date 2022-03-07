var express = require('express');
const async = require('hbs/lib/async');
const { ObjectId } = require('mongodb');
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
router.post('/buscar', function(req, res, next){
    buscarData(req.body)
        .then((elemento)=>{
            res.render('consultas_aggregate',{datos:elemento});
        })
        .catch((err)=>{
            res.send(err);
        })
        .finally(()=>{
            client.close()
        })
});


async function buscarData(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    let values = Object.values(datos);
    datos.nombre  = datos.nombre==="" ? null:datos.nombre;
    datos.edad    = datos.edad==="" ? null:datos.edad;
    datos.email   = datos.email==="" ? null:datos.email;
    datos.trabajo = datos.trabajo==="" ? null:datos.trabajo;
    datos.activo  = datos.activo==="on" ? true:false;
    const result = await collection.aggregate([
        {
            $match: {
                        $or:    [
                                    {email: datos.email},
                                    {nombre: datos.nombre},
                                    {edad: datos.edad},
                                    {trabajo: datos.trabajo},
                                    {activo: datos.activo},
                                ]
                    }
        }
    ]).toArray()
    return result;
}

//Inserta usuarios
router.post('/insertar', function(req, res, next){
    insertarData(req.body)
        .then((a)=>{
            res.redirect('/consultasA');
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            client.close();
        })
    
});

async function insertarData(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    const valida = await collection.aggregate([
        {
            $match: {email: datos.email},
        },
        {
            $limit: 1
        }
    ]).toArray();
    datos.activo  = datos.activo==="on" ? true:false;
    if(valida == false){
        await collection.insertOne({
            nombre: datos.nombre,
            edad: datos.edad,
            trabajo: datos.trabajo,
            email: datos.email,
            password: datos.password,
            activo: datos.activo
        });
    }else{
        console.log("El usuario ya existe");
    }
    
}

//Edita usuarios
router.post('/actualizar', function(req, res, next){
    actualizarData(req.body)
        .then(()=>{
            res.redirect('/consultasA');
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            client.close()
        })
    
});

async function actualizarData(datos){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    if(datos.activo !== undefined){
        values = {
            nombre: datos.nombre,
            edad: datos.edad,
            trabajo: datos.trabajo,
            email: datos.email,
            password: datos.password, 
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
    console.log(datos);
    await collection.updateOne(
        {
            _id: ObjectId(datos._id)
        },
        {
            $set: values
        }
    );
};

/* Elimina usuarios */
router.get('/eliminar/:_id', function(req, res, nex){
    eliminarData(req.params._id)
        .then(()=>{
            res.redirect('/consultasA');
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            client.close()
        })
});

async function eliminarData(id){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuariosEjemploAggregate');
    await collection.deleteOne({_id: ObjectId(id)});
}
module.exports = router;
