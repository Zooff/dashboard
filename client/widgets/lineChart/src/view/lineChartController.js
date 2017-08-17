
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
    this.config.series = this.series;
    this.jdata = data.jsonData;

    $scope.$on('chart-create', function(event, chart){
      graph.chart = chart;
    });

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){

        graph.config.expertReplace = args;
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
    // Option for the chart --> See the chart.js options
    this.options = {legend : {display : true, position :'bottom'}, scales : {}};

    if (this.config.noPoint){
      this.options.elements = {point : {hitRadius : 15, hoverRadius : 5, radius: 0}};
    }

    if (this.config.xAxeType){
      this.options.scales.xAxes = [{
        type: "time",
        time: {
          //  displayFormats : {
          //    'day' : 'DD-MM-YY',
          //    'hour': 'DD-MM-YY',
          //    'week': 'DD-MM-YY',
          //    'month': 'DD-MM-YY',
          //    'quarter': 'DD-MM-YY',
          //    'year': 'DD-MM-YY'
          //  },
          min : graph.label[0],
          max : graph.label[graph.label.length - 1]
        },
        ticks: {maxTicksLimit: 15}
      }]
    }

    this.options.scales.yAxes = [{
      display:true,
      type: 'linear',
      ticks: {
        callback: function(value, index, values){
          return graph.config.axeYSuf ?  value + graph.config.axeYSuf :  value;
        }
      }
    }];


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
      for( var k in graph.config.color){
        graph.color[k] = graph.config.color[k];
      }
    }

    // Events Management

    this.options.onClick = function(event, point){
      for (var scaleName in this.scales){
        var scale = this.scales[scaleName];
        console.log(scale, scale.isHorizontal())
        if (scale.isHorizontal()){
          var valueX = scale.getValueForPixel(event.offsetX);
          console.log(valueX)
          console.log(point)
          graph.options.scales.xAxes[0].time.min = valueX;
        }
      }
    }

    // Export CSV

    this.getLabel = function(){
      var array = graph.series.slice.unshift('Date');
      return array;
    }
    this.getValue = function(){
      return graph.jdata;
    }
  }

}
