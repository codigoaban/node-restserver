const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');



const Usuario = require('../models/usuario');


const app = express();

//listar usuarios de la base de datos
app.get('/usuario', function(req, res) {

    //paginacion desde la pagina actual o si no desde cero
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //cuantos registros debe mostrar por pagina x defecto 5
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            Usuario.count({ estado: true }, (err, conteo) => {
                //respuesta del servicio
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });



        })

});



//registrar un usuario
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })




});

//actualizacion de un registro
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //selecciona los campos a actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    //runValidators: true ( valida los roles)

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    })


});

app.delete('/usuario/:id', function(req, res) {
    // res.json('delete Usuario');
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

    //borra físicamente el registro
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    }); */




});


module.exports = app;