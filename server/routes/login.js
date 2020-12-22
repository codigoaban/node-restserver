const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    //devuelve solo un usuario
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraaseña incorrectos'
                }
            });
        }

        //compara si las contraseñas no son iguales
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            //si no son iguales
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraaseña) incorrectos'
                }
            });

        }


        //usuarioDB=> es el payload y es todo el usuario de la base de datos

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expira en 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token // es declarado lineas arriba
        });


    })


});











module.exports = app;