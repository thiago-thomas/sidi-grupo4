const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Fornecedor')
const Fornecedor = mongoose.model('fornecedor')
require('../models/Produto')
const Produto = mongoose.model('produto')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { eAdmin } = require('../helpers/eAdmin')

router.get('/', eAdmin, function (req, res) {
    usuario = req.user.nome;
    res.render('admin/index', { usuario: usuario })
})

router.get('/fornecedor', eAdmin, function (req, res) {
    Fornecedor.find().then(function (fornecedor) {
        res.render('admin/fornecedor', { fornecedor: fornecedor.map(fornecedor => fornecedor.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os fornecedores')
        res.redirect('/admin')
    })

})

router.get('/fornecedor/add', eAdmin, function (req, res) {
    res.render('admin/addfornecedor')
})

router.post('/fornecedor/new', eAdmin, function (req, res) {

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
        res.render('admin/addfornecedor', { erros: erros })
    } else {
        const novoFornecedor = {
            nome: req.body.nome,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            estado: req.body.estado,
            cep: req.body.cep
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

router.get('/fornecedor/edit/:id', eAdmin, function (req, res) {
    Fornecedor.findOne({ _id: req.params.id }).lean().then(function (fornecedor) {
        res.render('admin/editfornecedor', { fornecedor: fornecedor })
    }).catch(function (err) {
        req.flash('error_msg', 'Este fornecedor nao existe')
        res.redirect('/admin/fornecedor')
    })

})

router.post('/fornecedor/edit', eAdmin, function (req, res) {

    let filter = { _id: req.body.id }

    Fornecedor.findOne(filter).then(function (fornecedor) {

        fornecedor.nome = req.body.nome
        fornecedor.telefone = req.body.telefone
        fornecedor.cpf = req.body.cpf
        fornecedor.endereco = req.body.endereco
        fornecedor.bairro = req.body.bairro
        fornecedor.cidade = req.body.cidade
        fornecedor.estado = req.body.estado
        fornecedor.cep = req.body.cep

        fornecedor.save().then(function () {
            req.flash('sucess_msg', "Fornecedor editado com Sucesso")
            res.redirect('/admin/fornecedor')
        }).catch(function (err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao")
            res.redirect('/admin/fornecedor')
        })

    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o fornecedor')
        res.redirect('/admin/fornecedor')
    })

})

router.post('/fornecedor/del', eAdmin, function (req, res) {
    Fornecedor.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Fornecedor excluido com Sucesso")
        res.redirect('/admin/fornecedor')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir a fornecedor, tente novamente!")
        res.redirect('/admin/fornecedor')
    })
})


router.get('/produto', eAdmin, function (req, res) {
    Produto.find().then(function (produto) {
        res.render('admin/produto', { produto: produto.map(produto => produto.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os produtos')
        res.redirect('/admin')
    })

})

router.get('/produto/add', eAdmin, function (req, res) {
    res.render('admin/addproduto')
})

router.post('/produto/new', eAdmin, function (req, res) {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome em branco" })
    }

    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        erros.push({ texto: "Valor em branco" })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descricao em branco" })
    }

    if (erros.length > 0) {
        res.render('admin/addproduto', { erros: erros })
    } else {
        const novoProduto = {
            nome: req.body.nome,
            valor: req.body.valor,
            descricao: req.body.descricao
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

router.get('/produto/edit/:id', eAdmin, function (req, res) {
    Produto.findOne({ _id: req.params.id }).lean().then(function (produto) {
        res.render('admin/editproduto', { produto: produto })
    }).catch(function (err) {
        req.flash('error_msg', 'Este produto nao existe')
        res.redirect('/admin/produto')
    })

})

router.post('/produto/edit', eAdmin, function (req, res) {

    let filter = { _id: req.body.id }

    Produto.findOne(filter).then(function (produto) {

        produto.nome = req.body.nome
        produto.valor = req.body.valor
        produto.descricao = req.body.descricao

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

router.post('/produto/del', eAdmin, function (req, res) {
    Produto.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Produto excluido com Sucesso")
        res.redirect('/admin/produto')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir o produto, tente novamente!")
        res.redirect('/admin/produto')
    })
})

router.get('/usuarios', eAdmin, function (req, res) {
    Usuario.find().then(function (usuario) {
        res.render('admin/usuarios', { usuario: usuario.map(usuario => usuario.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os usuarios')
        res.redirect('/admin')
    })
})



router.get('/usuarios/add', eAdmin, function (req, res) {
    res.render('admin/addusuario')
})

router.post('/usuarios/new', eAdmin, function (req, res) {
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
                res.redirect('/admin/usuarios/add')
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, function (erro, salt) {
                    bcrypt.hash(novoUsuario.senha, salt, function (erro, hash) {
                        if (erro) {
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
                            res.redirect('/admin/usuarios/add')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(function () {
                            req.flash('sucess_msg', 'Usuario criado com sucesso!')
                            res.redirect('/admin')
                        }).catch(function () {
                            req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente!')
                            res.redirect('/admin/usuarios/add')
                        })
                    })
                })
            }
        }).catch(function (err) {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/admin')
        })
    }

})


router.get('/usuarios/edit/:id', eAdmin, function (req, res) {
    Usuario.findOne({ _id: req.params.id }).lean().then(function (usuario) {
        res.render('admin/editusuario', { usuario: usuario })
    }).catch(function (err) {
        req.flash('error_msg', 'Este Usuário nao existe')
        res.redirect('/admin/usuarios')
    })

})

router.post('/usuarios/edit', eAdmin, function (req, res) {

    let filter = { _id: req.body.id }

    Usuario.findOne({ email: req.body.email }).then(function (usuario) {
        if (usuario) {
            req.flash('error_msg', 'Erro! O Email já está cadastrado!')
            res.redirect('/admin/usuarios')
        } else {
            Usuario.findOne(filter).then(function (usuario) {

                usuario.nome = req.body.nome
                usuario.email = req.body.email

                usuario.save().then(function () {
                    req.flash('sucess_msg', "Usuario editado com Sucesso")
                    res.redirect('/admin/usuarios')
                }).catch(function (err) {
                    req.flash('error_msg', "Houve uma falha ao salvar a edicao")
                    res.redirect('/admin/usuarios')
                })

            }).catch(function (err) {
                req.flash('error_msg', 'Houve um erro ao editar o Usuario')
                res.redirect('/admin/usuarios')
            })
        }
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o Usuario')
        res.redirect('/admin/usuarios')
    })

    /*

    Usuario.findOne(filter).then(function (usuario) {

        usuario.nome = req.body.nome
        usuario.email = req.body.email

        usuario.save().then(function () {
            req.flash('sucess_msg', "Usuario editado com Sucesso")
            res.redirect('/admin/usuarios')
        }).catch(function (err) {
            req.flash('error_msg', "Houve uma falha ao salvar a edicao")
            res.redirect('/admin/usuarios')
        })

    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao editar o Usuario')
        res.redirect('/admin/usuarios')
    })
    */

})

router.post('/usuarios/del', eAdmin, function (req, res) {
    Usuario.remove({ _id: req.body.id }).then(function () {
        req.flash('sucess_msg', "Usuário excluido com Sucesso")
        res.redirect('/admin/usuarios')
    }).catch(function (err) {
        req.flash('error_msg', "Houve uma erro ao excluir o usuario, tente novamente!")
        res.redirect('/admin/usuarios')
    })
})

router.get('/vendas', eAdmin, function (req, res) {
    res.render('admin/vendas');
})

router.get('/vendas/add', eAdmin, function (req, res) {
    Produto.find().then(function (produto) {
        res.render('admin/addvenda', { produto: produto.map(produto => produto.toJSON()) })
    }).catch(function (err) {
        req.flash('error_msg', 'Houve um erro ao listar os produtos')
        res.redirect('/admin')
    })




    //res.render('admin/addvenda')
})

router.get('/teste', function (req, res) {
    res.send("Pagina de teste")
})


module.exports = router