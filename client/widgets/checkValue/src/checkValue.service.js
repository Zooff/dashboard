'use strict';

angular.module('adf.widget.checkValue')
  .service('checkValueService', checkValueService);

function checkValueService($q, $http, $parse){

  function createData(jsonData, config){

    config.keys = [];
    for(var key in jsonData){
      config.keys.push(key);
    }


    if (!config.root)
      config.root = config.keys[1];

    //
    var data = $parse(config.root)(jsonData);
    var ok = false;

    switch(config.op){
      case "eq":
        ok = (data == config.test);
        break;
      case "dif":
        ok = (data != config.test);
        break;
      case "sup":
        ok = (data > config.test);
        break;
      case "inf":
        ok = (data < config.test);
        break;
      default:
        ok = false;
    }

    if (!config.percentData){
      config.percentData = config.keys[0];
    }
    var percentData = $parse(config.percentData)(jsonData);

    if (!config.lastWeek){
      config.lastWeek = config.keys[2];
    }

    var lastWeek = $parse(config.lastWeek)(jsonData);

    return {config: config, data: data, ok: ok, percentData : percentData, lastWeek : lastWeek};
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
