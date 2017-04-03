var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var encoding ='utf8';
var storeDir = path.join(__dirname, '..', '..', '/store/dashboards/');

if (!fs.existsSync(storeDir)){
  console.log("could not find store directory at %s", storeDir);
  process.exit(1);
}


router.get('/', function(req, res, next){
  fs.readdir(storeDir, function(err, files){
    if (err) {
      return next(err);
    }
    var boards = [];
    files.forEach(function(file){
      var json = JSON.parse(fs.readFileSync(storeDir + file, encoding));
      boards.push({
        id: file.replace('.json', ''),
        title: json.title
      });
    });
    // send response
    res.json({
      dashboards: boards
    });
  });
});

router.get('/:id', function(req, res, next){
  fs.readFile(storeDir + req.params.id + '.json', encoding, function(err, data){
    if (err) {
      return next(err);
    }
    res.writeHead(200, {'Content-Type': 'routerlication/json'});
    res.end(data);
  });
});

router.post('/:id', function(req, res, next){
  fs.writeFile(
    storeDir + req.params.id + '.json',
    JSON.stringify(req.body, undefined, 2),
    function(err){
      if (err) {
        return next(err);
      }
      res.status(204).end();
    }
  );
});

router.delete('/:id', function(req, res, next){
  fs.unlink(storeDir + req.params.id + '.json', function(err){
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
});


module.exports = router;
