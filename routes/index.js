var express = require('express');
var router = express.Router();
var buscaCep = require('busca-cep');


router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;
