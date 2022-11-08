const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const validator = require('mongoose-validator')

// const flash = require('express-flash');
// const session = require('express-session')

//para porde referenciar los contenidos estaticos como imagenes, js, styles
app.use(express.static(__dirname + '/public' ));

//carpete de todos los htmls que son interpretados como ejs
app.set('views', __dirname + '/views');

//motor interprete de las vistas
app.set('view engine', 'ejs');

//para recuperar campos de formularios
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extends: true }));

//uso de librerias de validacion basica de campos
// let session = require('express-session')
// app.use(express.cookieParser('keyboard cat'));
// app.use(express.session({ cookie: { maxAge: 60000 }}));
// app.use(flash());

//para conectarnos o crear la BD
mongoose.connect('mongodb://localhost/citasdb', { useNewUrlParser: true });

//Generamos un esquema de objeto JSON que almacenaremos
const CitaSchema = new mongoose.Schema(
    {
    name: {type: String, required: [true,'nombre: no puede ser vacio'], unique:[true,'nombre: ya existe registrado']},
    comentario: { type: String, required: [true,'comentario: no puede ser vacio']}
    },{timestamps: true }
);

// crea un objeto que contenga métodos para que Mongoose interactúe con MongoDB
const Cita = mongoose.model('Cita', CitaSchema);

//carga la paginia inical del sitio
app.get('/', function (req, res) {
    let arrErrores = [''];
    res.render('index', {errores: arrErrores})
})

//agrega una ruta que permite agregar un elemento a la BD
app.post('/citas', (req, res) => {
    let arrErrores = ['(*) campos requeridos'];
    
    const cita = new Cita();
    cita.name = req.body.name;
    cita.comentario = req.body.comentario;

    cita.save()
        .then(() =>  res.redirect('/'))
        .catch(err => {
            for (var key in err.errors) {
                arrErrores.push(err.errors[key].message)
            }
            res.render('index', {errores: arrErrores})
        });
});

app.get('/citas', (req, res) => {
    let arrErrores = [''];
  
    // db.collection_name.find ().sort ( { name_of_date_field : 1 (Display the date in ascending order)} )
    //db.collection_name.find ().sort ( { name_of_date_field : -1 (Display the date in descending order) } )
    Cita.find().sort({timestamp:-1})
        .then(data => res.render("agenda", { agendas: data }))
        .catch(err => {
            for (var key in err.errors) {
                arrErrores.push(err.errors[key].message)
            }
            res.render('index', {errores: arrErrores})
        });

});


//exponemos el servidor en el la ip:puerto requerido
app.listen(5000, function () {
    console.log('servidor ejecutandose en http://localhost:5000');
});

