//Carregando Modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)
    require('./models/Usuario')
    const Usuario = mongoose.model('usuarios')
    const bcrypt = require('bcryptjs')

//Configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true, 
            saveUninitialized: true
        }))

        //Passport
        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //Middleware
        app.use(function(req,res,next) {
            res.locals.sucess_msg = req.flash("sucess_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
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

    app.get('/registro', function (req, res) {
        res.render('registro')
    })

    app.post('/registro', function (req, res) {
        var erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: 'Nome inválido' })
        }

        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
            erros.push({ texto: 'E-mail inválido' })
        }

        if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
            erros.push({ texto: 'Senha inválida' })
        }

        if (req.body.senha.length < 4) {
            erros.push({ texto: 'Senha muito curta' })
        }

        if (req.body.senha != req.body.senha2) {
            erros.push({ texto: 'As senhas não coincidem, tente novamente' })
        }

        if (erros.length > 0) {
            res.render('registro', { erros: erros })
        } else {
            Usuario.findOne({ email: req.body.email }).then(function (usuario) {
                if (usuario) {
                    req.flash('error_msg', 'Erro! O Email já está cadastrado!')
                    res.redirect('registro')
                } else {
                    const novoUsuario = new Usuario({
                        eAdmin: 1,
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    })

                    bcrypt.genSalt(10, function (erro, salt) {
                        bcrypt.hash(novoUsuario.senha, salt, function (erro, hash) {
                            if (erro) {
                                req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
                                res.redirect('/')
                            }

                            novoUsuario.senha = hash

                            novoUsuario.save().then(function () {
                                req.flash('sucess_msg', 'Usuario criado com sucesso!')
                                res.redirect('/')
                            }).catch(function () {
                                req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente!')
                                res.redirect('registro')
                            })
                        })
                    })
                    }
                }).catch(function (err) {
                    req.flash('error_msg', 'Houve um erro interno')
                    res.redirect('/')
                })
            }
        })

        app.post('/', passport.authenticate('local', {
                failureRedirect: '/',
                failureFlash: true
            }), (req, res, next) => {
                if (req.user.eAdmin == 1) {
                    res.redirect('/admin/');
                }else{
                    res.redirect('/usuarios/')
                }
        });

        app.get('/logout', function (req, res) {
            req.logout()
            req.flash('sucess_msg', 'Você foi deslogado com sucesso!')
            res.redirect('/')
        })



    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
//Outros
const PORT = 8090
app.listen(PORT, function(){
    console.log('Servidor Rodando!')
})