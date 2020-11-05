const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { type } = require('os')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
require('../models/Fornecedor')
const Fornecedor = mongoose.model('fornecedor')
require('../models/Produto')
const Produto = mongoose.model('produto')
const passport = require('passport')
const {logado} = require('../helpers/logado')

router.get('/', logado, function(req, res) {
    usuario = req.user.nome;
    res.render('usuarios/index', {usuario: usuario})
})

router.get('/fornecedor', logado, function (req, res) {
    Fornecedor.find().then(function (fornecedor) {
        res.render('usuarios/fornecedor', { fornecedor: fornecedor.map(fornecedor => fornecedor.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os fornecedores')
        res.redirect('/usuarios')
    })

})

router.get('/fornecedor/add', logado, function (req, res) {
    res.render('usuarios/addfornecedor')
})

router.post('/fornecedor/new', logado, function (req, res) {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome em branco" })
    }

    if (!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null) {
        erros.push({ texto: "Telefone em branco" })
    }

    if (req.body.telefone.length < 6) {
        erros.push({ texto: "Telefone invalido" })
    }

    if (erros.length > 0) {
        res.render('usuarios/addfornecedor', { erros: erros })
    } else {
        const novoFornecedor = {
            nome: req.body.nome,
            telefone: req.body.telefone
        }

        new Fornecedor(novoFornecedor).save().then(function () {
            req.flash("sucess_msg", "Fornecedor criado com sucesso!")
            res.redirect("/usuarios/fornecedor")
        }).catch(function (err) {
            req.flash("error_msg", "Houve um erro ao criar o fornecedor, tente novamente!")
            res.redirect("/usuarios")
        })
    }


})

router.get('/fornecedor/edit/:id', logado, function (req, res) {
    Fornecedor.findOne({ _id: req.params.id }).lean().then(function (fornecedor) {
        res.render('usuarios/editfornecedor', { fornecedor: fornecedor })
    }).catch(function (err) {
        req.flash('error_msg', 'Este fornecedor nao existe')
        res.redirect('/usuarios/fornecedor')
    })

})

router.post('/fornecedor/edit', logado, function (req, res) {

    let filter = { _id: req.body.id }

    Fornecedor.findOne(filter).then(function (fornecedor) {

        fornecedor.nome = req.body.nome
        fornecedor.telefone = req.body.telefone

        fornecedor.save().then(function () {
            req.flash('sucess_msg', "Fornecedor editado com Sucesso")
            res.redirect('/usuarios/fornecedor')
        }).catch(function (err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao")
            res.redirect('/usuarios/fornecedor')
        })

    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o fornecedor')
        res.redirect('/usuarios/fornecedor')
    })

})

router.post('/fornecedor/del', logado, function (req, res) {
    Fornecedor.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Fornecedor excluido com Sucesso")
        res.redirect('/usuarios/fornecedor')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir a fornecedor, tente novamente!")
        res.redirect('/usuarios/fornecedor')
    })
})


router.get('/produto', logado, function (req, res) {
    Produto.find().then(function (produto) {
        res.render('usuarios/produto', { produto: produto.map(produto => produto.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os produtos')
        res.redirect('/usuarios')
    })

})

router.get('/produto/add', logado, function (req, res) {
    res.render('usuarios/addproduto')
})

router.post('/produto/new', logado, function (req, res) {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome em branco" })
    }

    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        erros.push({ texto: "Valor em branco" })
    }

    if (erros.length > 0) {
        res.render('usuarios/addproduto', { erros: erros })
    } else {
        const novoProduto = {
            nome: req.body.nome,
            valor: req.body.valor
        }

        new Produto(novoProduto).save().then(function () {
            req.flash("sucess_msg", "Produto criado com sucesso!")
            res.redirect("/usuarios/produto")
        }).catch(function (err) {
            req.flash("error_msg", "Houve um erro ao criar o produto, tente novamente!")
            res.redirect("/usuarios")
        })
    }


})

router.get('/produto/edit/:id', logado, function (req, res) {
    Produto.findOne({ _id: req.params.id }).lean().then(function (produto) {
        res.render('usuarios/editproduto', { produto: produto })
    }).catch(function (err) {
        req.flash('error_msg', 'Este produto nao existe')
        res.redirect('/usuarios/produto')
    })

})

router.post('/produto/edit', logado, function (req, res) {

    let filter = { _id: req.body.id }

    Produto.findOne(filter).then(function (produto) {

        produto.nome = req.body.nome
        produto.valor = req.body.valor

        produto.save().then(function () {
            req.flash('sucess_msg', "Produto editado com Sucesso")
            res.redirect('/usuarios/produto')
        }).catch(function (err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao do produto")
            res.redirect('/usuarios/produto')
        })

    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o produto')
        res.redirect('/usuarios/produto')
    })

})

router.post('/produto/del', logado, function (req, res) {
    Produto.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Produto excluido com Sucesso")
        res.redirect('/usuarios/produto')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir o produto, tente novamente!")
        res.redirect('/usuarios/produto')
    })
})


router.get('/teste', function (req, res) {
    res.send("Pagina de teste")
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