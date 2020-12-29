const express = require('express');

//let { verificaToken } = require('../middlewares/autenticacion');
const { verificaToken, verficaAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

const app = express();



app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                categorias
            })



        });
});




app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }


        //Si no existe la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });

        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })



    })

});


app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id, para obtener este dato hay que enviar el verificaToken

    let body = req.body; // de aqui sale la descripcion

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        //Si nos e creo la categoria, mostrara un error
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }


        //mostrar la categoria registrada
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


})


app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }


        //mostrar la categoria
        res.json({
            ok: true,
            categoria: categoriaDB
        });



    });

})


app.delete('/categoria/:id', [verificaToken, verficaAdmin_Role], (req, res) => {
    //solo el administrador puede borrar las categorias
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });

        }


        res.json({
            ok: true,
            message: 'Categoria borrada'
        });





    });


})

module.exports = app;