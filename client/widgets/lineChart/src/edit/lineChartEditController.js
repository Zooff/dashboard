'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, $http, config, lineChartService){
  this.config = config;

  $scope.getAutocompletion = function(val){
    return $http.get('/api/servers/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

}
