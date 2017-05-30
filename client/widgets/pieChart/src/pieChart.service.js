'use strict';

angular.module('adf.widget.pieChart')
  .service('pieChartService', pieChartService);

function pieChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var label = [];
  var value = [];


  function createData(jsonData, config){

    var getLabel, getValue;
    config.key = [];

    for (var key in jsonData[0]){
      config.key.push(key);
    }

    if(!config.label)
      config.label = config.key[0];

    if(!config.value)
      config.value = config.key[1];

    getLabel = $parse(config.label);
    getValue = $parse(config.value);
    label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData.map(function(u){return getValue(u);});
    return {config : config, label: label, value: value, type: config.type, desc : config.desc};
  }

  function fetch(config){
    var url = config.url.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
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
    else if (config.datasource){
      if (config.datasource.selected)
        config.url = config.datasource.selected.url;
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
