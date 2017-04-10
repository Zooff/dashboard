'use strict';

angular.module('adf.widget.singleValue')
  .service('singleValueService', singleValueService);

function singleValueService($q, $http, $parse){

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
      principalData: {},
      additionalData: []
    };

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
    return $http.get(config.url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function get(config){
    var result = null;
    if (config.url){
      result = fetch(config);
    }
    return result;
  }

  return {
    get: get
  };
}
