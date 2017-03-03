module.exports = function(application){
	application.post('/', function(req, res){
		application.app.controllers.chat.iniciaChat(application, req, res);
	});

	application.get('/', function(req, res){
		application.app.controllers.chat.iniciaChat(application, req, res);
	});
}