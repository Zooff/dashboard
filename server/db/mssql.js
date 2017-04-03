var mssql = require('mssql');
var config = require("../../config");

db = config.mssqlDB;

var connect = new mssql.Connection({
  user: db.user,
  password: db.password,
  server: db.server,
  database: db.database
});

connect.connect(function(err){
  if(err){
    console.log('Error connection to Mysql Database');
  }
  console.log('Connection to the Mysql Database established ');
});
