module.exports.exibir = function(application, req, res){
	res.render("login",{validacao: {}});
}

module.exports.autenticar = function(application, req, res){

	var dados = req.body;
	req.assert('login','Login é obrigatório!').notEmpty();
	req.assert('Senha','Senha é obrigatória!').notEmpty();

	var erros = req.validationErrors();

	if (erros) {
		res.render("login",{validacao:erros});
		return;
	}

	application.get('io').emit(
		'msgParaCliente',
		{apelido: 'teste', mensagem: ' acabou de entrar no chat'}
	)

	res.render("chat");
}