var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var {client, dbName} = require('../db/mongo');

/* GET home page. */
router.get('/', function (req, res, next) {
    allData()
        .then((dato)=>{
            res.render('consultas_aggregate', { datos: dato });
        })  
        .catch((err)=>{
            console.log(err);
        })
});

async function allData(){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("usuariosEjemplo");
    let datos = await collection.aggregate([{$match:{}}]).toArray();
    return datos;
}

module.exports = router;
