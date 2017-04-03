var dbUnix = require('./mysql');

var serverDao = {

  // Return all Unix Server
  getAllUnixServer : function(callback){
    // Query SQL
    var query = 'SELECT name, alias, env, site, type, description, appli, client FROM check_server.server '
    dbUnix.query(query, function(err, rows){
      if (err){
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }
  // Return all active Server
  getAllUnixActiveServer : function(callback){
    var query = 'SELECT name, alias, env, site, type, description, appli, client FROM check_server.server WHERE code <> 40'
    dbUnix.query(query, function(err, rows){
      if (err){
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }

  // return the unique Server who name = id
  getByIdUnixServer : function(id, callback){
    var query = 'SELECT name, alias, env, site, type, description, appli, client FROM check_server.server WHERE name = ' + id;
    dbUnix.query(query, function(err, rows){
      if (err){
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }

}

module.exports = serverDao;
