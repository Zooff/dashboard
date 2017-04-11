'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, config, lineChartService){
  this.config = config;

}
