var mysql = require('mysql');
var config = require("../../config");

db = config.mysqlDB;

var con = mysql.createConnection({
    host: db.host;
    user: db.user;
    password: db.password;
});

con.connect(function(err){
  if(err){
    console.log('Error connection to Mysql Database');
  }
  console.log('Connection to the Mysql Database established ');
});
