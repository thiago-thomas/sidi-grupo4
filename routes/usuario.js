const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { type } = require('os')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const passport = require('passport')
const {logado} = require('../helpers/logado')

router.get('/', logado, function(req, res) {
    res.render('usuarios/index')
})

/*
router.get('/registro', function(req, res){
    res.render('usuarios/registro')
})
*/

/*

router.post('/registro', function(req, res){
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'E-mail inválido' })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'Senha inválida' })
    }

    if(req.body.senha.length < 4) {
        erros.push({texto: 'Senha muito curta'})
    }

    if(req.body.senha != req.body.senha2) {
        erros.push({texto: 'As senhas não coincidem, tente novamente'})
    }

    if(erros.length > 0) {
        res.render('usuarios/registro', {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then(function(usuario){
            if(usuario){
                req.flash('error_msg', 'Erro! O Email já está cadastrado!')
                res.redirect('/usuarios/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10,function(erro, salt) {
                    bcrypt.hash(novoUsuario.senha, salt, function(erro, hash){
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(function(){
                            req.flash('sucess_msg', 'Usuario criado com sucesso!')
                            res.redirect('/')
                        }).catch(function(){
                            req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente!')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })
            }
        }).catch(function(err){
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})
*/
/*
router.get('/login', function (req, res) {
    res.render('usuarios/login')
})

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/usuarios',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', function (req, res){
    req.logout()
    req.flash('sucess_msg', 'Você foi deslogado com sucesso!')
    res.redirect('/')
})
*/
module.exports = router