var express = require('express');
var router = express.Router();
var buscaCep = require('busca-cep');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.connection.remoteAddress);
  res.render('index', { title: 'Express' });
});

/* Via Cep API */
router.get('/cep', function (req, res, next) {
  var cep = req.query.cep;
  buscaCep(cep, { sync: false, timeout: 1000 })
    .then(endereco => {
      console.log(cep);
      res.send(`<p>CEP: <i>${endereco.cep}</i></p><p>RUA: <i>${endereco.logradouro}</i></p><p>BAIRRO: <i>${endereco.bairro}</i></p><p>CIDADE: <i>${endereco.localidade}</i></p><p>ESTADO: <i>${endereco.uf}</i></p><p>IBGE: <i>${endereco.ibge}</i></p><p>DDD: <i>${endereco.ddd}</i></p><p>SIAFI: <i>${endereco.siafi}</i></p>`);
    })
    .catch(erro => {
      res.send(`<h1 style="color: red">ERRO CEP INVALIDO</h1>`)
    });
});

module.exports = router;
