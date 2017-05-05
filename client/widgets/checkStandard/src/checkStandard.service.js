'use strict';

angular.module('adf.widget.checkStandard')
  .service('checkStandardService', checkStandardService);

function checkStandardService($q, $http, $parse){

  function createData(jsonData, config){


    if (config.principalData){
      var principalData = $parse(config.principalData)(jsonData);
    }

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

    return {config: config, data: data, ok: ok, principalData : principalData};
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
