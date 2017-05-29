'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, $http, config, lineChartService){
  this.config = config;
  config.dataSource = {};

  $scope.getAutocompletion = function(val){
    return $http.get('/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

  this.getDatabase = function(){
    return $http.get('/expert')
      .then(function(response){
        return response.data;
      });
  }

}
