
'use strict';

angular.module('adf.widget.cactiChart')
  .controller('cactiChartController', cactiChartController);

function cactiChartController($rootScope, $scope, data, cactiChartService){
  if (data){
    var graph = this;
    this.config = data.config;
    this.url = data.url;

    this.listTime = ['jour', 'semaine', 'mois', 'year'];
    this.timeUnit = 'jour';

    var getTimestamp = function(graph.timeUnit){
      var now = moment().unix();
      var last;
      switch(graph.timeUnit){
        case 'jour':
          last = now - (24 * 60 * 60);
          break;
        case 'semaine':
          last = now - (7 * 24 * 60 * 60);
          break;
        case 'mois' :

          break;
        case 'year':
          break;
      }
    }


    var pointDown;
    var pointUp;

    this.mousedown = function(){

    }

    this.mouseup = function(){

    }



  }

}
