
'use strict';

angular.module('adf.widget.gaugeStandard')
  .controller('gaugeStandardController', gaugeStandardController);

function gaugeStandardController($scope, data, gaugeStandardService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.data = data.data;
    this.label = data.label;
    this.desc = data.desc;

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
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
