'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardEditController', checkStandardEditController);

function checkStandardEditController($scope, $http, config, checkStandardService){
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
    return $http.get('/api/standard/column', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

  // load the array of columns
  function getColumns(standard){
    if (!standard && !config.columns){
      config.columns = [];
    }
    if (standard && !config.datasources){
      config.datasources = [];
    }
    return standard ? config.datasources : config.columns;
  }

  this.addColumn = function(standard){
    getColumns(standard).push({});
  };

  this.removeColumn = function(standard, index){
    getColumns(standard).splice(index, 1);
  };

  this.load = function(){
    checkStandardService.get(config.url);
  }

}
