'use strict';

angular.module('adf.widget.gaugeStandard')
  .service('gaugeStandardService', gaugeStandardService);

function gaugeStandardService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/gauge";

  function createData(jsonData, config){
    console.log(jsonData);
    return {config : config, data: jsonData[0]};
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
    if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'exp'){
      result = post(config, expertUrl);
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
