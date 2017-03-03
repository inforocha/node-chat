
var app = require('./config/server');

/* parametrizar a porta de escuta */
var server = app.listen(3000, function(){
	console.log('Servidor online');
});

var io = require('socket.io').listen(server);

app.set('io', io);
// Nomes dos usuarios que estao conectados no chat
var usernames = {};

// salas que são preconfiguradas para o chat
var rooms = ['Suporte','Desenvolvimento','todos'];

/**
Eventos server-side
	# Ocorre quando o servidor recebe uma nova conexão de cliente.
		io.sockets.on(‘connection’, function(socket)) 
	# Ocorre quando um cliente usa a função send();, o callback desse evento serve para automaticamente responder o cliente no final da execução deste evento.
		socket.on(‘message’, function(mensagem, callback)) 
	# Eventos customizados pelo desenvolvedor, qualquer nome pode ser apelidado aqui e o seu comportamento é de apenas receber através do data dados enviados pelo cliente. No nosso exemplo prático, criamos o evento toServer.
		socket.on(‘qualquer-nome-de-evento’, function(data)) 
	# Ocorre quando um cliente sai da área conectada ou emite o evento disconnect para o servidor.
		socket.on(‘disconnect’) 
Mensageria server-side
	# Envia uma mensagem para o cliente que se comunicou com o servidor.
		socket.emit(‘evento’, variaveis)
	# Envia uma mensagem para todos os clientes conectados ao servidor, exceto o cliente que se 
	# comunicou com o servidor, ou seja, se numa sala de chat temos 4 clientes e o cliente X emitiu 
	# uma mensagem ao servidor, os outros 3 clientes receberão o retorno de uma mensagem menos o cliente X.
		socket.broadcast.emit(‘evento’, variaveis) 
	# Envia uma mensagem para todos conectados ao socket. similar ao acima.
		io.emit(‘broadcast’, variaveis) 
	# Envia mensagem para todos os clientes na sala 'game' exceto o que enviou
  		socket.to('game').emit('nice game', "mensagem enviada");
  	# Envia mesagem para todos os clientes na sala 'game1' e/ou na sala 'game2', exceto o que enviou
		socket.to('game1').to('game2').emit('nice game', "mensagem enviada");
	# Envia mensagem para todos os clientes na sala 'game' incluindo o que enviou
		io.in('game').emit('big-announcement', 'mensagem enviada');
	# Envia para um individual socketid (mesagem privada)
  		socket.to(<socketid>).emit('hey', 'mensagem enviada');
Eventos client-side
	# emit aceita um terceiro parametro que eh um calback que sera executado logo apos o termino do evento
		socket.emit('question', 'alguma coisa', function (answer) {});
	# Ocorre quando o cliente se conecta ao servidor.
		socket.on(‘connect’) 
	# Ocorre quando o cliente esta se conectando ao servidor.
		socket.on(‘connecting’) 
	# Ocorre quando o cliente deseja se desconectar do servidor.
		socket.on(‘disconnect’) 
	# Ocorre quando o cliente não conseguiu se conectar no servidor.
		socket.on(‘connect_failed’) 
	# Ocorre quando o cliente já se conectou, porém ocorreu um erro grave no servidor durante as trocas de mensagens.
		socket.on(‘error’) 
	# Ocorre quando o cliente envia uma mensagem de resposta rápida ao servidor, cuja resposta acontece através da função de callback.
		socket.on(‘message’, function (message, callback)) 
	# Evento customizado pelo desenvolvedor. No nosso exemplo criamos o evento toClient.
		socket.on(‘qualquer-nome-de-evento’, function(data)) 
	# Ocorre quando o cliente não consegue se reconectar ao servidor.
		socket.on(‘reconnect_failed’) 
	# Ocorre quando o cliente se reconecta ao servidor.
		socket.on(‘reconnect’) 
	# Ocorre quando o cliente esta se reconectando ao servidor.
		socket.on(‘reconnecting’) 
Mensageria client-side
	# Envia uma mensagem para o cliente que se comunicou com o servidor.
		socket.emit(‘evento’, variaveis) 
*/
io.sockets.on('connection', function (socket) {

	/**
	* when the client emits 'adduser', this listens and executes
	*/
	socket.on('adduser', function(username){
console.log('addUser '+username);
		// armazena o nome de usuario 'username' na sessao do socket para este clente
		socket.username = username;
		// armazena a sala na sessao do socket para este cliente
		socket.room = 'todos';
		// adiciona o nome do usuario na lista global username
		usernames[username] = username;
		// insere o cliente na sala room1
		socket.join('todos');
		// envia-o uma mensagem informando sobre ele estar conectado
		socket.emit('updatechat', 'SERVER', 'Você está conectado a sala todos');
		// envia para todos os outros da sala a informacao que ele se conectou
		socket.broadcast.to('todos').emit('updatechat', 'SERVER', username + ' conectou-se a esta sala');
		socket.emit('updaterooms', rooms, 'todos');
	});

	/**
	* Quando o cliente emite 'sendchat', ele escuta e executa
	*/
	socket.on('sendchat', function (data) {
console.log('sendchat '+data);
		// envia uma mensagem para o cliente informando o usuario que enviou e a mensagem enviada.
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	/**
	* desconecta o usuario da sala atual e conecta-o em uma nova sala
	* @param String newroon - nome da nva sala
	*/
	socket.on('switchRoom', function(newroom){
console.log('switchRoom '+newroom);
		socket.leave(socket.room); // sai da sala atual (armazenado em sessao)
		socket.join(newroom); // junta-se a nova sala
		socket.emit('updatechat', 'SERVER', 'Você está conectado a sala '+ newroom);
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' saiu desta sala'); // enviando mensagem para sala que esta saindo
		socket.room = newroom; // atualizando a sessao do socket com o nome da nova sala
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' entou nesta sala');
		socket.emit('updaterooms', rooms, newroom);
	});

	/**
	* quando o usuario desconecta
	*/
	socket.on('disconnect', function(){
		// remove o nome de usuario da lista global de usernames
		delete usernames[socket.username];
		// atualiza a lista de usuarios no chat, client-side
		io.sockets.emit('updateusers', usernames);
		// avisa para todos que o usuario desconectou
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});

	/**
	* upload de arquivos
	*/
    socket.on('send-file', function(name, buffer) {
        var fs = require('fs');

        //path to store uploaded files (NOTE: presumed you have created the folders)
        var fileName = __dirname + '/tmp/uploads/' + name;

        fs.open(fileName, 'a', 0755, function(err, fd) {
            if (err) throw err;

            fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                fs.close(fd, function() {
                    console.log('File saved successful!');
                });
            })
        });

    });
});