var eventos = {
	eventos: {},
	on: function(nomeDoEvento, funcao) {
		this.eventos[nomeDoEvento] = this.eventos[nomeDoEvento] || [];
		this.eventos[nomeDoEvento].push(funcao);
	},
	off: function(nomeDoEvento, funcao) {
		if (this.eventos[nomeDoEvento]) {
			for (var i = 0; i < this.eventos[nomeDoEvento].length; i++) {
				if (this.eventos[nomeDoEvento][i] === funcao) {
					this.eventos[nomeDoEvento].splice(i,1);
					break;
				}
			}
		}
	},
	emit: function(nomeDoEvento, parametros) {
		if (this.eventos[nomeDoEvento]) {
			this.eventos[nomeDoEvento].forEach(function(fn){
				fn(parametros)
			});
		}
	}
}