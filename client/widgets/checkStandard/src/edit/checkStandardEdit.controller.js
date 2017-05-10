'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardEditController', checkStandardEditController);

function checkStandardEditController($rootScope, $http, config, checkStandardService){
  this.config = config;

  this.getAutocompletion = function(val){
    return $http.get('/api/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

  this.getDatabase = function(){
    return $http.get('/api/standard')
      .then(function(response){
        return response.data;
      });
  }

  this.getColumns = function(val){
    return $http.get('/api/standard/columns', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    }).then(function(data){
      config.colDatabase = data;
    });
  }

  this.broadcast = function(){
    $rootScope.$broadcast('DatTest', 'OK')
  }

  // load the array of columns
  function getColumns(standard){
    if (!standard && !config.columns){
      config.columns = [];
    }
    if (standard && !config.test){
      config.test = [];
    }
    return standard ? config.test : config.columns;
  }

  this.addColumn = function(standard){
    getColumns(standard).push({});
  };

  this.removeColumn = function(standard, index){
    getColumns(standard).splice(index, 1);
  };
}
