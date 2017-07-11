'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueEditController', checkValueEditController);

function checkValueEditController($scope, $http, config, checkValueService){
  this.config = config;

  $scope.getAutocompletion = function(val){
    return $http.get('/api/autocomplete', {
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
    checkValueService.get(config.url);
  }

}
