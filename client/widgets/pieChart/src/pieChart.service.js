'use strict';

angular.module('adf.widget.pieChart')
  .service('pieChartService', pieChartService);

function pieChartService($q, $http, $parse){
  var expertUrl = "/api/expert/query";
  var label = [];
  var value = [];


  function createData(jsonData, config){
    var getLabel = $parse(config.label);
    var getValue = $parse(config.value);
    label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData.map(function(u){return getValue(u);});
    return {label: label, value: value, type: config.type, desc : config.desc};
  }

  function fetch(config){
    return $http.get(config.url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createData(data, config);
      });
  }

  function get(config){
    var result = null;
    if (config.expert){
      result = post(config);
    }
    else if (config.url){
      result = fetch(config);
    }
    return result
  }

  function post(config){
    return $http.post(expertUrl, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createData(data, config);
      });
  }


  return {
    get: get
  };
}
