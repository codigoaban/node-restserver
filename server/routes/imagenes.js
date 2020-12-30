const express = require('express');

const fs = require('fs');

const path = require('path');

const { verficaTokenImg } = require('../middlewares/autenticacion');

let app = express();


app.get('/imagen/:tipo/:img', verficaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    //let pathImg = `./uploads/${ tipo }/${ img } `;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        //extraer path absoluto
        //__dirname=> ubica en el direcotiro donde esta el archivo a ejecutar, es decir la carpeta routes
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);

    }





});


module.exports = app;