'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, $http, config, pieChartService){
  this.config = config;
  config.datasource = {}
}
