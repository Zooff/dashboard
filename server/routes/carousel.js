var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var encoding ='utf8';
var file = path.join(__dirname, '..', '..', '/store/carousel.json');

if (!fs.existsSync(file)){
  console.log("could not find File at %s", file);
  process.exit(1);
}

router.get('/', function(req, res, next){
  var json = JSON.parse(fs.readFileSync(file, encoding));
  res.status(200).json(json.carousel);
});

router.post('/', function(req, res, next){
  var json = JSON.parse(fs.readFileSync(file, encoding));
  json.carousel.push(req.body.text);
  fs.writeFile(
    file,
    JSON.stringify(json, undefined, 2),
    function(err){
      if (err) {
        return next(err);
      }
      res.status(204).end();
    }
  );
});

router.delete('/:id', function(req, res, next){
  var json = JSON.parse(fs.readFileSync(file, encoding));
  console.log(req.body);
  json.carousel.splice(req.params.id, 1);
  fs.writeFile(
    file,
    JSON.stringify(json, undefined, 2),
    function(err){
      if (err) {
        return next(err);
      }
      res.status(204).end();
    }
  );
})


module.exports = router;
