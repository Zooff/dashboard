'use strict';

angular.module('adf.widget.lineChart')
  .service('lineChartService', lineChartService);

function lineChartService($q, $http, $parse){
  // EndPoint Url for the expert mode
  var expertUrl = '/expert/query';
  var standardUrl = '/standard/lineChart';
  var label = [];
  var value = [];


  function createData(jsonData, config){
    label = [];
    value = [];
    config.key = [];
    var getLabel, getValue, getValue2;

    // Get all the key to give user a choice
    for (var k in jsonData[0]){
      config.key.push(k);
    }

    // Try to be smart... This cant be right because Json object are Hashmap...
    if (!config.label)
      config.label = config.key[0];

    getLabel = $parse(config.label);

    if (!config.value)
      config.value = config.key[1];

    getValue = $parse(config.key[1]);

    if (!config.value2)
      config.value2 = config.key[2];

    getValue2 = $parse(config.value2);

    label = jsonData.map(function(u){return getLabel(u);});
    var val = jsonData.map(function(u){return getValue(u);});
    var val2 = jsonData.map(function(u){return getValue2(u)});
    value.push(val);
    value.push(val2);
    return {config: config, label: label, value: value, type: config.type, desc : config.desc, series: [config.value, config.value2]};
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
    if (config.mode == 'exp'){
      result = post(config, expertUrl);
    }
    else if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'easy'){
      if(config.datasource.selected){
        config.url = config.datasource.selected.url;
      }
      result = fetch(config);
    }
    return result
  }

  function post(config, url){
    return $http.post(url, config)
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
