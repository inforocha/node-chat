var mysql = require('mysql');

var connMySQL = function(){
	return mysql.createConnection({
		host : '10.0.0.233',
		user : 'root',
		password : '',
		database : 'inforgeneses44'
	});
}

module.exports = function () {
	return connMySQL;
}