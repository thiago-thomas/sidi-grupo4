//Carregando Modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const usuarios = require('./routes/usuario')

    const app = express()

//Configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true, 
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use(function(req,res,next) {
            res.locals.sucess_msg = req.flash("sucess_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/mercado", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log("MongoDB Conectado");
        }).catch((erro) => {
            console.log("Houde um erro " + erro);
        })
    //Public
        app.use(express.static(path.join(__dirname,"public")))
//Rotas

    app.get('/', function(req, res) {
        res.render('index')
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
//Outros
const PORT = 8090
app.listen(PORT, function(){
    console.log('Servidor Rodando!')
})