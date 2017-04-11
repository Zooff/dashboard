
'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService){
  if (data){
    this.label = data.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
  }
  // Option for the chart --> See the chart.js options
  this.options = {legend : {display : true, position :'left'}};

}
