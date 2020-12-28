require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//hablitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global de rutas
app.use(require('./routes/index'));





//cafe nombre de base de datos
//conexion local
/* mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos online");
    }); */




//const MongoClient = require('mongodb').MongoClient; // para la capa free

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("Base de datos online");
});



/*
//ok, conexion
mongoose.connect(process.env.URLDB).then(() => {
    console.log("Base de datos conectada");
}).catch((err) => {
    console.log("No se pudo establecer la conexion a la BD ERROR! ", err);
});*/




app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});