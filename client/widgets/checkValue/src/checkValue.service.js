'use strict';

angular.module('adf.widget.checkValue')
  .service('checkValueService', checkValueService);

function checkValueService($q, $http, $parse){

  function createData(jsonData, config){


    if (config.rootData){
      var principalData = $parse(config.rootData)(jsonData);
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

  return {
    get: get
  };
}
