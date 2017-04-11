
'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartController', lineChartController);

function lineChartController($scope, data, lineChartService){
  if (data){
    this.label = data.label;
    this.value = data.value;
    // Type of graph : line, bar, horizontalBar, radar
    this.type = data.type;
    this.desc = data.desc;
  }
  // Option for the chart --> See the chart.js options
  this.options = {};

}
