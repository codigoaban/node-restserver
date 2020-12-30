const jwt = require('jsonwebtoken');

//==========================================
//Verificar token
//==========================================

let verificaToken = (req, res, next) => {
    //recuperar el valor que viene en los headers de la API
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        //un return si el acceso no pasa, no autorizado. Si logra pasar la info es correcta
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //decoded= todo lo que se encuentra en el payload con la propiedad usuario
        //usuario: viene del login.js => jwt.sign. 
        req.usuario = decoded.usuario;

        //para que ejecute el codigo que sigue despues de verificar el token. Sin esto el codigo que sigue en la funcion donde se ha colocado el token, no se ejecuta
        next(); // debe estar dentro de la funcion, si está afuera siempre se ejecutara aunque el token sea invalido
    })

}


//====================
//Verifica AdminRole, - MiddleWare
//====================

let verficaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    //res.json(usuario.role);


    if (usuario.role === 'ADMIN_ROLE') {

        //permite ejecutar el codigo que sigue luego de verificar
        next();


    } else {


        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }



}


//====================
//Verifica Token de la Imagen - MiddleWare
//====================

let verficaTokenImg = (req, res, next) => {
    let token = req.query.token;

    /*res.json({
        token: token
    })*/

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificaToken,
    verficaAdmin_Role,
    verficaTokenImg
}