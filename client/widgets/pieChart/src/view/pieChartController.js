
'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
  // Option for the chart --> See the chart.js options
    var cut;
    (this.type == 'doughnut') ? cut = 75 : cut = 0;
    this.options = {elements: {arc: {borderWidth : 1, borderColor : '#222222'}}, cutoutPercentage : cut};

    if (this.config.legend){
      this.options.legend = {display : true, position : this.config.legendPosition};
    }

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        pieChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

    this.open = function(points, evt){
      if (graph.config.mode != 'std'){
        return;
      }
      console.log(points[0]._model.label);
      // Build the condition to obtain the data
      // To do this, add a rule : column selected = label of the part who has been cliked
      var condi =graph.config.condition;
      condi.group.rules.push({condition: '=', field: graph.config.columnStandard ,data: points[0]._model.label})
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/pieChart/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServicePC', function(modalService){
            return modalService.fetch(graph.config, condi);
          }]
        }
      });
    }
  }
}
