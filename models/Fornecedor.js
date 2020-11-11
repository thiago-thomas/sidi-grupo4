const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Fornecedor = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: Number,
        required: true
    },
    cpf: {
        type: Number,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    cep: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('fornecedor', Fornecedor)