const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('produto', Produto)