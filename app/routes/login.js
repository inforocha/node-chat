module.exports = function(application){
	application.post('/autenticar', function(req, res){
		application.app.controllers.login.autenticar(application, req, res);
	});

	application.get('/', function(req, res){
		application.app.controllers.login.exibir(application, req, res);
	});
}