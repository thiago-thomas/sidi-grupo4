const express = require('express');
const app = express();
const port = 8081;
const path = require('path');
const buscaCep = require('busca-cep');
const googleKey = 'AIzaSyDXDlt5rOQyizdtd5jQipsFFlbX8utZwVE';
const googleMapsClient = require('@google/maps').createClient({
  key: googleKey
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

