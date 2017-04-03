var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ data: [
    {id: 1, name: "server1", prop1:"Steady"},
    {id: 2, name: "server2", prop1:"Ready"},
    {id: 3, name: "server3", prop1:"Go"}
  ]});
});

module.exports = router;
