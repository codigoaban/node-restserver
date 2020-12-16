require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



app.get('/usuario', function(req, res) {
    res.json('Get usuarios');
});

app.post('/usuario', function(req, res) {
    let bodyPost = req.body;

    if (bodyPost.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: bodyPost
        });
    }


});

app.put('/usuario/:id', function(req, res) {
    let idUser = req.params.id;
    //res.json('Put usuarios');
    res.json({
        idUser
    });
});

app.delete('/usuario', function(req, res) {
    res.json('Delete usuarios');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 3000);

});