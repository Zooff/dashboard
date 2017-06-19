
'use strict';

angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartController', gaugeChartController);

function gaugeChartController($scope, data, gaugeChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    this.desc = data.desc;

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        gaugeChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

  }
}
