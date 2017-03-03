
(function(btn) {
	var obj = {
		init: function() {
			// this.socket = io.connect('http://10.0.0.4:3000');
			this.socket = io.connect('localhost:3000');
			var that = this;
			$(function() {
				that.cacheDom();
				that.bindEvents();
				that.evtp_Coneccao();
				that.evtc_atualizarMensagem();
				that.evtc_atualizarSalas();
			});
			eventos.on('upload',this.evtc_upload);
		},
		cacheDom: function() {
			this.btnEnvioMensagem = document.getElementById('datasend');
			this.inputEnvioMensagem = document.getElementById('data');
		},
		bindEvents: function() {
			this.btnEnvioMensagem.addEventListener('click', this.enviarMensagemDigitada.bind(this));
			this.btnEnvioMensagem.addEventListener('keypress', this.enviaMensagemEnter.bind(this));
		},
		enviarMensagemDigitada: function(e) {
				e.preventDefault();
				e.stopPropagation();
				var message = this.inputEnvioMensagem.value;
				this.inputEnvioMensagem.value = '';
				// tell server to execute 'sendchat' and send along one parameter
				this.socket.emit('sendchat', message);
		},
		enviaMensagemEnter: function(e) {
			if(e.which == 13) {
				this.btnEnvioMensagem.dispatchEvent(new Event('click'));
			}
		},
		/* 
			EVENTOS RELACIONADOS AO SOCKET 
			siglas evtp significa evento padrao do soketio, evtc significa evento customizado pelo desenvolvedor
		*/
		evtp_Coneccao: function() {
			var that = this;
			// Ao conectar-se ao servidor, questiona o nome de usuario como callback anonimo
			this.socket.on('connect', function(){
				// chamada a funcao server-side 'adduser' enviando o parametro digitado no prompt
				that.socket.emit('adduser', prompt("Qual o seu nome?"));
			});
		},
		evtc_atualizarMensagem: function() {
			// listener, whenever the server emits 'updatechat', this updates the chat body
			this.socket.on('updatechat', function (nomeUsuario, dados) {
				var dayName = new Array ("domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado");
				var monName = new Array ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro");
				var now = new Date;
				var data = dayName[now.getDay()]+", "+now.getDate ()+" de "+monName[now.getMonth()]+" de "+now.getFullYear();
				var hora = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+":"+now.getMilliseconds();
				
				$('#conversation').append(
					'<div class="message sent">'
						+nomeUsuario + ': ' + dados + 
					    '<span class="metadata"><span class="time">'+
					    	data + ' ' + hora +
					    '</span></span>'+
				    '</div>'
				);
			});
		},
		evtc_atualizarSalas: function() {
			var that = this;
			// Escuta quando o servidor emite o evento 'updaterooms' e atualiza a listagem de salas no cliente.
			this.socket.on('updaterooms', function(salas, salaAtual) {
				var div, divSalas = document.getElementById('salas');
				divSalas.innerHTML = '';

				for (var i = 0; i < salas.length; i++) {

					div = document.createElement("div");
					div.className = "user-bar link";
					div.id = salas[i];
					div.appendChild(document.createTextNode(salas[i]));
					if(salas[i] != salaAtual){
						div.addEventListener('click',function(e) {
							that.socket.emit('switchRoom', e.target.id);
							btn.exibirChat();
						});
					}
					divSalas.appendChild(div);
				}
			});
		},
		evtc_upload: function(dados) {
			this.socket.emit('send-file', dados.name, dados.buffer);
		}
	};
	obj.init();
})(botoes);