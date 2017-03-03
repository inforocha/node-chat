module.exports.iniciaChat = function(application, req, res){

	application.get('io').emit(
		'msgParaCliente',
		{apelido: 'teste', mensagem: ' acabou de entrar no chat'}
	)

	res.render("index");
}
