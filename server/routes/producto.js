const express = require('express');

const { verificaToken, verficaAdmin_Role } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');

let app = express();

let Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');


//===============================
//Traer todos los productos
//===============================

app.get('/productos', (req, res) => {
    //traer todos los productos
    //populate: uusuario y categoria del producto
    //paginar
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 3;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde) //saltar x pagina
        .limit(limite) // cuantos x pagina
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            })



        })


})



//===============================
//Obtener un porducto por Id
//===============================
/*
//OK: funciona
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id del producto no se encontró'
                }
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        })



    }).populate('usuario', 'nombre').populate('categoria', 'descripcion');


})
*/

//Otra forma
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }


            //en caso ingrese el usuario un DI no valido
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no valido'
                    }

                });
            }


            res.json({
                ok: true,
                producto: productoDB

            });



        });


});


//===============================
//Buscar producto
//===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //i para que no diferencie entre mayusculas y minusculas

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });

})


//===============================
//Crear el producto
//===============================
app.post('/productos', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar la categoria del listado de categorias


    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    //res.json({ producto });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });


    })



})



//===============================
//Actualizar el producto
//===============================
/* 
//Actualizar Mio -> funciona
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let actualizar = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    }

    //Verificar si el id del producto existe
    Producto.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra el ID del Producto que quiere actualizar'
                }
            })
        }


        res.json({
            ok: true,
            producto: productoDB
        })


    });

}) */

//Actualizar otra forma de recoger los datos
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra el ID del Producto que quiere actualizar'
                }
            });
        }


        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        //res.json({ productoDB })
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        });



    });


})


//===============================
//Borrar el producto
//===============================
/*
//si funciona
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Colocar el campo Disponible=false en la tabla
    let id = req.params.id;

    let estadoProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, estadoProducto, [verificaToken, verficaAdmin_Role], { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no existe'
                }
            });
        }


        res.json({
            ok: true,
            message: 'Producto borrado'
        });


    })
})
*/

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }


        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });


        })


    })


});




module.exports = app;