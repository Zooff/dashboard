var express = require('express');
var serverDao = require('../db/serverDao');

var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.json({ data: [
    {id: 1, name: "server1", prop1:"Steady"},
    {id: 2, name: "server2", prop1:"Ready"},
    {id: 3, name: "server3", prop1:"Go"}
  ]});
});

/* Get All the unix server */
router.get('/unix', function(req, res, next){
  serverDao.getAllUnixServer(function(err, data){
    if (err){
      res.status(err.status).send(err.message);
    }
    res.status(200).json(data);
  })
});

/* GET all the active unix server */
router.get('/unix/active', function(req, res, next){
  serverDao.getAllUnixActiveServer(function(err, data){
    if(err){
      res.status(err.status).send(err.message);
    }
    res.status(200).json(data);
  });
});

/* GET the server of name : name */
router.get('/unix/:name', function(req, res, next){
  /* req.params.name match the :name of the URL */
  /* If url = /unix/server1 --> name = server1 */
  serverDao.getByIdUnixServer(req.params.name, function(err, data){
    if (err){
      res.status(err.status).send(err.message);
    }
    res.status(200).json(data);
  });
});



module.exports = router;
