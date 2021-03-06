
'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal, $timeout){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.series = data.series;
    this.config.colorLabel = [];
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
    this.id = Math.random().toString(36).substr(2,10);
    console.log(this.id);
  // Option for the chart --> See the chart.js options

    this.series.forEach(function(el){
      graph.config.colorLabel.push(el.name);
    })

    graph.options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: '100%'
      },
      tooltip: {
        pointFormat: '{point.name}: <i>{point.y}</i> - <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          size: '100%',
          slicedOffset: 5,
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
          states: {
            hover: {
              halo: false
            }
          }
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
        floating: false,
        verticalAlign: 'bottom',
        align: 'center',
        itemStyle: {
          color: "#337AB7"
        }
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
    graph.export = function($event){
      console.log('ok')
      var svg = graph.chart.getSVG({
        exporting: {
          sourceWidth: graph.chart.chartWidth,
          sourceHeight: graph.chart.chartHeight
        }
      });
      var canvas = document.createElement('canvas');
      canvas.height = 1000 * graph.chart.chartHeight / graph.chart.chartWidth;
      canvas.width = 1000;
      document.body.appendChild(canvas);
      var img = new Image;
      img.onload = function(){
        canvas.getContext('2d').drawImage(this, 0,0, 1000, 1000 * graph.chart.chartHeight / graph.chart.chartWidth)
      }
      img.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
      var ev = $event.currentTarget
      // canvg(canvas, svg, {
      //   scaleWidth : 500,
      //   scaleHeight : 500,
      //   ignoreDimensions : true
      // });
      // IE
      if (canvas.msToBlob){
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, 'graph.png')
      }
      else {
         var img = canvas.toDataURL("image/png");
        // img = img.replace('image/png', 'image/octet-stream');
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
      graph.options.plotOptions.pie.point = {
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
