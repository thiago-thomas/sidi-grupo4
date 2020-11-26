var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    usuario: {type: String, require: true},
    cart: {type: Object, required: true},
});

module.exports = mongoose.model('Order', schema);