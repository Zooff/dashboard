'use strict';

angular.module('adf.widget.cactiChart')
  .controller('cactiChartEditController', cactiChartEditController);

function cactiChartEditController($scope, $http, config, cactiChartService){
  var graph = this;
  this.config = config;
  this.graphs = [];

  this.getGraph = function(hostId){
    return $http.get('/standard/cactiGraphId/' + hostId)
      .then(function(response){
        graph.graphs = response.data;
      });
  }

  this.getHost = function(model){
    return $http.get('/standard/cactiHost', {
      params: {
        model : model
      }
    })
    .then(function(response){
      return response.data;
    })
  }

}
