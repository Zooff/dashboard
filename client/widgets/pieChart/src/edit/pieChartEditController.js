'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, config, pieChartService){
  this.config = config;

}
