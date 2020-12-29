const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token // es declarado lineas arriba
        });


    })


});


//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    //retornar la promesa
    return {
        mombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }
}

//verify().catch(console.error);


//para colocar un await debe estar declarada la funcion com async

app.post('/google', async(req, res) => {

    //idtoken viene de Google
    let token = req.body.idtoken;

    //recibimos el token de Google y llamamos la funcion verify
    //Si esta mal entra al catch, si no recibe un objeto googleUser
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    /*res.json({
        usuario: googleUser
    });*/
    //si el email es igual al googleUser
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {


            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su atenticacion normal'
                    }
                });

            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expira en 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }




        } else {
            //primera vez a registrar con las credenciales de Google



            let usuario = new Usuario();
            usuario.nombre = googleUser.mombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '123456';

            /* res.json({
                 usuario
             })*/

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expira en 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });



            })








        }

    })


});











module.exports = app;