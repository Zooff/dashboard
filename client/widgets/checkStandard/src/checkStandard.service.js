'use strict';

angular.module('adf.widget.checkStandard')
  .service('checkStandardService', checkStandardService);

function checkStandardService($q, $http, $parse){

  var apiEndPoint ='/standard';
  var expertUrl = '/expert/query';

  function createData(jsonData, config){
    return {config: config, data : jsonData};
  }

  // Standard Mode, post to /standard
  function fetch(config){
    return $http.post(apiEndPoint, config)
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
    else if (config.databaseStandard){
      result = fetch(config);
    }
    return result
  }


  // Expert Mode, post to /expert
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
