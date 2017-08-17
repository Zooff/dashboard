'use strict';

angular.module('adf.widget.paginateTable')
  .service('paginateTableService', paginateTableService);

function paginateTableService($q, $http, $parse){

  var expertUrl = "/expert/query";
  var standardUrl = "/standard/";

  function createColumns(config, model){
    var columns = [];

    // Add the column want by the user
    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        model.headers[i] = col.title;
        columns.push({
          title: col.title,
          path: $parse(col.path),
          opt : col.opt
        });
      }
    });

    // Obtain the columns that the user dont want to see
    var diff = config.keys.filter(function(x){
      return !config.columns.find(function(el){
        return el.title == x;
      })
    });

    // Add them to be used by the master mode
    angular.forEach(diff, function(col2, i2){
      columns.push({
        title: col2,
        path: $parse(col2),
        opt: 'hidden'
      });
    });

    return columns;
  }

  function createDataModel(config, data){
    var model = {
      headers: [],
      rows: [],
      itemPerPage : config.itemPerPage
    };
    config.keys = [];


    // Master widget column broadcast
    for (var k in data[0]){
        config.keys.push(k);
    }

    if (config.clear){
      config.columns = [];
    }

    // Conf auto
    if (!config.columns || !config.columns.length){
        config.columns = [];
        for (var key in data[0]){
          var t = key.replace(/_/g, ' ');
          t = t.replace(/^bool/, '');
          config.columns.push({title : t, path : key, col : null});
        }
    }

    var root = data;
    if (config.root){
      root = $parse(config.root)(data);
    }

    var columns = createColumns(config, model);
    angular.forEach(root, function(node){
      var row = [];

      angular.forEach(columns, function(col, i){
        var value = col.path(node);
        row[i] = {value : value, opt : col.opt, title: col.title};
      });

      model.rows.push(row);
    });
    model.totalItems = model.rows.length;
    model.columns = config.columns;
    model.config = config;
    return model;
  }

  function fetch(config){
    var url = config.url.replace(/:\w+/, config.urlReplace)
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function post(config, url){
    return $http.post(url, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function get(config){
    var result = null;
    if (config.mode == 'exp'){
      result = post(config, expertUrl);
    }
    else if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'easy'){
      if (config.datasource.selected)
        config.url = config.datasource.selected.url;
      result = fetch(config);
    }
    return result
  }


  return {
    get: get
  };
}
