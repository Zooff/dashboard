
'use strict';

angular.module('adf.widget.gaugeStandard')
  .controller('gaugeStandardController', gaugeStandardController);

function gaugeStandardController($scope, data, gaugeStandardService, $uibModal){
  console.log(data)
  if (data){
    var graph = this;
    this.config = data.config;
    graph.data = data.data;
    this.label = data.label;
    this.desc = data.desc;

    console.log(graph.data)

    if (data.config.listener){
      $scope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        gaugeStandardService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

  }
}
