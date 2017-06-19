'use strict';

angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartEditController', gaugeChartEditController);

function gaugeChartEditController($scope, $http, config, gaugeChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  
}
