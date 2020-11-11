const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Venda = new Schema({
    produtos: [
        {
            produto: {
                type: Object,
                require: true
            },
            quantidade: {
                type: Number,
                require: true
            }
        }
    ],
    usuario: {
        email: {
            type: String,
            required: true
        },
        usuarioId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Usuario'
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('venda', Venda);