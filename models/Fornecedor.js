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
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('fornecedor', Fornecedor)