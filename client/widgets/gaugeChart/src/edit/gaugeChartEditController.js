'use strict';

angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartEditController', gaugeChartEditController);

function gaugeChartEditController($scope, $http, config, gaugeChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  this.addSeuil = function(){
    if (!graph.config.seuil){
      graph.config.seuil = [];
    }
    graph.config.seuil.push({});
  }

  this.removeSeuil = function($index){
    graph.config.seuil.splice($index, 1);
  }


}
