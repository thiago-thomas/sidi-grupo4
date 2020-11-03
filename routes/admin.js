const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Fornecedor')
const Fornecedor = mongoose.model('fornecedor')
require('../models/Produto')
const Produto = mongoose.model('produto')

router.get('/', function(req, res) {
    res.render('admin/index')
})

router.get('/fornecedor', function (req, res) {
    Fornecedor.find().then(function(fornecedor) {
        res.render('admin/fornecedor', { fornecedor: fornecedor.map(fornecedor => fornecedor.toJSON())})
    }).catch(function(err) {
        req.flash('error_msg', 'Houve um erro ao listar os fornecedores')
        res.redirect('/admin')
    })
    
})

router.get('/fornecedor/add', function (req, res) {
    res.render('admin/addfornecedor')
})

router.post('/fornecedor/new', function (req, res) {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome em branco"})
    }

    if (!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null) {
        erros.push({ texto: "Telefone em branco" })
    }

    if(req.body.telefone.length < 6) {
        erros.push({texto: "Telefone invalido"})
    }

    if(erros.length > 0){
        res.render('admin/addfornecedor', {erros: erros})
    } else {
        const novoFornecedor = {
            nome: req.body.nome,
            telefone: req.body.telefone
        }

        new Fornecedor(novoFornecedor).save().then(function () {
            req.flash("sucess_msg", "Fornecedor criado com sucesso!")
            res.redirect("/admin/fornecedor")
        }).catch(function (err) {
            req.flash("error_msg", "Houve um erro ao criar o fornecedor, tente novamente!")
            res.redirect("/admin")
        })
    }

    
})

router.get('/fornecedor/edit/:id', function(req, res) {
    Fornecedor.findOne({_id: req.params.id}).lean().then(function(fornecedor){
        res.render('admin/editfornecedor', {fornecedor: fornecedor})
    }).catch(function(err) {
        req.flash('error_msg', 'Este fornecedor nao existe')
        res.redirect('/admin/fornecedor')
    })
     
})

router.post('/fornecedor/edit', function (req, res) {

    let filter = {_id: req.body.id }

    Fornecedor.findOne(filter).then(function(fornecedor){

        fornecedor.nome = req.body.nome
        fornecedor.telefone = req.body.telefone

        fornecedor.save().then(function() {
            req.flash('sucess_msg', "Fornecedor editado com Sucesso")
            res.redirect('/admin/fornecedor')
        }).catch(function(err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao")
            res.redirect('/admin/fornecedor')
        })
        
    }).catch(function(err) {
        req.flash('error_msg', 'Houve um erro ao editar o fornecedor')
        res.redirect('/admin/fornecedor')
    })

})

router.post('/fornecedor/del', function(req, res) {
    Fornecedor.remove({_id: req.body.id}).then(function() {
        req.flash('sucess_msg', "Fornecedor excluido com Sucesso")
        res.redirect('/admin/fornecedor')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir a fornecedor, tente novamente!")
        res.redirect('/admin/fornecedor')
    })
})


router.get('/produto', function (req, res) {
    Produto.find().then(function (produto) {
        res.render('admin/produto', { produto: produto.map(produto => produto.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os produtos')
        res.redirect('/admin')
    })

})

router.get('/produto/add', function (req, res) {
    res.render('admin/addproduto')
})

router.post('/produto/new', function (req, res) {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome em branco" })
    }

    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        erros.push({ texto: "Valor em branco" })
    }

    if (erros.length > 0) {
        res.render('admin/addproduto', { erros: erros })
    } else {
        const novoProduto = {
            nome: req.body.nome,
            valor: req.body.valor
        }

        new Produto(novoProduto).save().then(function () {
            req.flash("sucess_msg", "Produto criado com sucesso!")
            res.redirect("/admin/produto")
        }).catch(function (err) {
            req.flash("error_msg", "Houve um erro ao criar o produto, tente novamente!")
            res.redirect("/admin")
        })
    }


})

router.get('/produto/edit/:id', function (req, res) {
    Produto.findOne({ _id: req.params.id }).lean().then(function (produto) {
        res.render('admin/editproduto', { produto: produto })
    }).catch(function (err) {
        req.flash('error_msg', 'Este produto nao existe')
        res.redirect('/admin/produto')
    })

})

router.post('/produto/edit', function (req, res) {

    let filter = { _id: req.body.id }

    Produto.findOne(filter).then(function (produto) {

        produto.nome = req.body.nome
        produto.valor = req.body.valor

        produto.save().then(function () {
            req.flash('sucess_msg', "Produto editado com Sucesso")
            res.redirect('/admin/produto')
        }).catch(function (err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao do produto")
            res.redirect('/admin/produto')
        })

    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o produto')
        res.redirect('/admin/produto')
    })

})

router.post('/produto/del', function (req, res) {
    Produto.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Produto excluido com Sucesso")
        res.redirect('/admin/produto')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir o produto, tente novamente!")
        res.redirect('/admin/produto')
    })
})


router.get('/teste', function (req, res) {
    res.send("Pagina de teste")
})


module.exports = router