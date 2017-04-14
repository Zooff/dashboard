'use strict';

angular.module('adf.widget.lineChart')
  .service('lineChartService', lineChartService);

function lineChartService($q, $http, $parse){
  // EndPoint Url for the expert mode
  var expertUrl = '/api/expert/query';
  var label = [];
  var value = [];


  function createData(jsonData, config){
    label = [];
    value = [];
    var getLabel = $parse(config.label);
    var getValue = $parse(config.value);
    var getValue2 = $parse(config.value2);
    label = jsonData.map(function(u){return getLabel(u);});
    var val = jsonData.map(function(u){return getValue(u);});
    var val2 = jsonData.map(function(u){return getValue2(u)});
    value.push(val);
    value.push(val2);
    return {label: label, value: value, type: config.type, desc : config.desc, series: [config.value, config.value2]};
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
