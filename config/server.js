/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign (serve como um middleware que gera um autoload)*/
var consign = require('consign');

/* importar o módulo do body-parser (serve como um middleware para ler o corpo das requisicoes POST)*/
var bodyParser = require('body-parser');

/* importar o módulo do express-validator (cria validacoes de dados trafegados)*/
var expressValidator = require('express-validator');

/* importar o módulo do express-validator (cria validacoes de dados trafegados)*/
var path = require('path');

/* iniciar o objeto do express */
var app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs'); // por padrao o express utiliza jade. Alterado para ejs que parece mais com php.
app.set('views', './app/views'); // Utilizamos apasta app/views porque eh padrao do express.

/* configurar o middleware express.static (definindo a pasta dos assets)*/
app.use(express.static('./app/public'));
/* configurar o middleware express.static (definindo a pasta do Bower)*/
app.use(express.static('./bower_components'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Origin','*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true})); // configuracao para aceitar corpo da requisicao POST
app.use(bodyParser.json()); // configuracao para aceitar corpo da requisicao Json

/* configurar o middleware express-validator */
app.use(expressValidator());

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	//.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* exportar o objeto app */
module.exports = app;