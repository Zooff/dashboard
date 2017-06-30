
'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.config.colorLabel = this.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;

    this.config.color = this.config.color ? this.config.color : null;
  // Option for the chart --> See the chart.js options
    var cut;
    (this.type == 'doughnut') ? cut = 75 : cut = 0;
    this.options = {elements: {arc: {borderWidth : 1, borderColor : '#222222'}}, cutoutPercentage : cut};

    if (this.config.legend){
      this.options.legend = {display : true, position : this.config.legendPosition};
    }



    // Add label and/or percent on the Pie Chart
    if (this.config.type != 'polarArea' && (this.config.pourcent || this.config.pieValue)){
      graph.options.animation = {};
      graph.options.animation.onComplete = function(){

        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(20, 'normal',Chart.defaults.global.defaultFontFamily );
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function(dataset){
          for (var i = 0; i < dataset.data.length; i++){
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = '#fff'; //Color of the text

            var val = dataset.data[i];
            var percent = String(Math.round(val/total*100) + "%");

            if (model.circumference > 0 && val != 0){
              if (graph.config.pieValue)
               ctx.fillText(dataset.data[i], model.x + x , model.y + y - 5);
              if (graph.config.pourcent)
                ctx.fillText(percent, model.x + x, model.y + y + 15);
            }
          }
        })
      };
    }

    // if (this.config.v3d){
    //   graph.options.elements.arc.borderWidth = 10;
    //   graph.options.elements.arc.borderColor = '#fff';
    // }

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        pieChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

    $scope.$on('chart-create', function(event, chart){
      graph.chart = chart;
    });

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

    this.open = function(points, evt){
      if (graph.config.mode != 'std'){
        return;
      }
      // Get the label of the clicked segemnt -->  console.log(points[0]._model.label);
      // Build the condition to obtain the data
      // To do this, add a rule : column selected = label of the part who has been cliked
      var condi =angular.copy(graph.config); // Do a copy to not impact the widget configuration
      condi.condition.group.rules.push({condition: '=', field: graph.config.columnStandard ,data: points[0]._model.label})
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
  }
}
