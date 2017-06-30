
'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartController', lineChartController);

function lineChartController($rootScope, $scope, data, lineChartService){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    // Type of graph : line, bar, horizontalBar, radar
    this.type = data.type;
    this.desc = data.desc;
    this.series = data.series;

    $scope.$on('chart-create', function(event, chart){
      graph.chart = chart;
    });

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){

        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        lineChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.series = response.series;
        });
      });
    }
  }
  // Option for the chart --> See the chart.js options
  this.options = {legend : {display : true, position :'bottom'}};

  if (this.config.noPoint){
    this.options.elements = {point : {hitRadius : 15, hoverRadius : 5, radius: 0}};
  }

  if (this.config.minValue || this.config.maxValue || this.config.step){
    this.options.scales = {yAxes : [{
      display:true,
      type: 'linear',
      ticks: {}
    }]};
    console.log(this.options);
  }

  if (this.config.minValue){
    this.options.scales.yAxes[0].ticks.min = parseInt(graph.config.minValue, 10);
  }

  if (this.config.maxValue){
    this.options.scales.yAxes[0].ticks.max = parseInt(graph.config.maxValue, 10);
  }

  if (this.config.step){
      this.options.scales.yAxes[0].ticks.stepSize = parseInt(graph.config.step, 10);
  }

  if (graph.config.color){
    graph.color = [];
    graph.color.push(graph.config.color);
    if (graph.config.color2){
      graph.color.push(graph.config.color2)
    }
  }





}
