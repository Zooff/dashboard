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

router.get('/master/:id', function(req, res, next){
  fs.readFile(storeDir + '_master_' + req.params.id  + '.json', encoding, function(err, data){
    if (err){
      var master = {
        "title" : "Master Page",
        "titleTemplateUrl" : "templates/custom-dashboard-title.html",
        "addTemplateUrl" : "templates/custom-add-widget.html",
        "structure" : "4-8",
        "rows" : [{
          "columns" : [{
            "styleClass" : "col-md-4",
            "widgets" : []
          },{
            "styleClass" : "col-md-8",
            "widgets" : []
          }]
        }]
      }
      return fs.writeFile(storeDir + '_master_' + req.params.id  + '.json', JSON.stringify(master, undefined, 2), function(err2){
        if (err2){
          return next(err2);
        }
        fs.readFile(storeDir + '_master_' + req.params.id  + '.json', encoding, function(err3, data2){
          if(err3){
            return next(err3);
          }
          res.writeHead(200, {'Content-Type' : 'routerlication/json'});
          res.end(data2);
        })
      })
    }

    res.writeHead(200, {'Content-Type' : 'routerlication/json'});
    res.end(data);
  })
})

router.get('/:id', function(req, res, next){
  fs.readFile(storeDir + req.params.id + '.json', encoding, function(err, data){
    if (err) {
      return next(err);
    }
    res.writeHead(200, {'Content-Type': 'routerlication/json'});
    res.end(data);
  });
});

router.post('/copy/:id', function(req, res, next){
  console.log(req.body)
  var file = storeDir + req.params.id + '.json';
  var newName = file.replace(/_\D*_/, '_'+req.body.category+ '_');
  fs.writeFile(
    newName,
    JSON.stringify(req.body.model, undefined, 2),
    function(err){
      if (err){
        return next(err);
      }
      res.status(204).end();
    }
  );
})


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

router.post('/master/:id', function(req, res, next){
  fs.writeFile(
    storeDir + '_master_' + req.params.id  + '.json',
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
