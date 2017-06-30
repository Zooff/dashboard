'use strict';

angular.module('adf.widget.singleValue')
  .service('singleValueService', singleValueService);

function singleValueService($q, $http, $parse){
  var expertUrl = "/expert/query";

  function createColumns(config){
    var columns = [];

    angular.forEach(config.columns, function(col, i){
      if (col.path) {
        columns.push({
          title: col.title,
          path: $parse(col.path)
        });
      }
    });

    return columns;
  }

  function createDataModel(config, data){
    var model = {
      config: config,
      principalData: {},
      additionalData: []
    };
    config.list = [];
    for (var key in data){
      config.list.push(key);
    }
    var root = data;
    if (config.root){
      var principalData = $parse(config.root)(data);
      model.principalData = {desc: config.desc, data: principalData};
    }

    var columns = createColumns(config);

    angular.forEach(columns, function(col, i){
      var value = col.path(data);
      model.additionalData.push({title: col.title, data: value});
    });
    return model;
  }

  function fetch(config){
    var url = config.url.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data[0]);
      });
  }

  function get(config){
    var result = null;
    if (config.expert){
      result = post(config);
    }
    else if (config.datasource){
      if(config.datasource.selected)
        config.url = config.datasource.selected.url;
      result = fetch(config);
    }
    return result;
  }

  function post(config){
    return $http.post(expertUrl, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        if (data.code){
          var principalData = {data : data.code};
          var model = {config : config, principalData : principalData1};
        }
        return createDataModel(config, data[0]);
      });
  }

  return {
    get: get
  };
}
