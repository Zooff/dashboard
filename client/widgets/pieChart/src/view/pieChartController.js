
'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.series = data.series;
    this.config.colorLabel = this.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
    this.id = Math.random().toString(36).substr(2,10);
    console.log(this.id);
  // Option for the chart --> See the chart.js options

    graph.options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        margin: 0,
        height: '100%'
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          size: '75%',
          slicedOffset: 0,
          borderWidth: 3,
          allowPointSelect: true,
          depth: 45,
          dataLabels: {
             enabled: false
          }

        },
        series: {
          borderColor: 'transparent',
          borderWidth: 5,
        }
      },
      series: [{
        type: 'pie',
        data: graph.series
      }],
      title: {
        text: null
      },
      legend: {
        itemMarginTop: 5
      },
      credits: {
        enabled: false
      }

    }

    if (this.type == 'doughnut') {
      this.options.plotOptions.pie.innerSize = '75%';
    }
    if (this.config.legend){
      this.options.plotOptions.pie.showInLegend = {
        enabled: true
      };
    }
    if (this.config.v3d){
      graph.options.chart.options3d = {
        enabled: true,
        alpha: 45,
        beta: 0
      }
    }
    if (graph.config.color){
      graph.color = [];
      for (var k in graph.config.color){
        graph.color[k] = graph.config.color[k];
      }
      graph.options.plotOptions.pie.colors = graph.color;
    }

    if (graph.config.pourcent || graph.config.pieValue){
      graph.options.plotOptions.pie.dataLabels = {
        enabled: true,
        distance: -20,
        formatter: function(){
          var str = ""
          if (this.percentage != 0){
            if (graph.config.pourcent)
              str += this.percentage.toFixed(1) + '%';
            if (graph.config.pieValue)
              str += " "+ this.y
          }
          return str;
        }
      }
    }
    


    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.expertReplace = args;
        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        pieChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.chart.series[0].setData(response.series);
        });
      });
    }

    // PNG export
    this.export = function($event){

      // IE
      if (graph.chart.chart.canvas.msToBlob){
        var blob = graph.chart.chart.canvas.msToBlob();
        window.navigator.msSaveBlob(blob, 'graph.png')
      }
      else {
        var img = graph.chart.toBase64Image();
        img = img.replace('image/png', 'image/octet-stream');
        $event.currentTarget.href = img;
        $event.currentTarget.download = 'graph.png';
      }
    }

    this.open = function(name){
      // Get the label of the clicked segemnt -->  console.log(points[0]._model.label);
      // Build the condition to obtain the data
      // To do this, add a rule : column selected = label of the part who has been cliked
      var condi =angular.copy(graph.config); // Do a copy to not impact the widget configuration
      condi.condition.group.rules.push({condition: '=', field: graph.config.columnStandard ,data: name})
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/pieChart/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServicePC', function(modalService){
            return modalService.fetch(condi);
          }]
        }
      });
    }

    if (graph.config.mode == 'std'){
      graph.options.plotOptions.series = {
        cursor: 'pointer',
        events: {
          click: function(event){
            graph.open(this.name);
          }
        }
      }
    }
    angular.element(document).ready(function(){
      graph.chart = Highcharts.chart(graph.id, graph.options);
    })
  }
  // Only build the graph when all option are config
}
