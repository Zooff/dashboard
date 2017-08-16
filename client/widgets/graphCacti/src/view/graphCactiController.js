
'use strict';

angular.module('adf.widget.cactiChart')
  .controller('cactiChartController', cactiChartController);

function cactiChartController($rootScope, $scope, data, cactiChartService){
  if (data){
    var graph = this;
    this.config = data.config;
    this.urlSave = data.url;
    this.url = data.url;

    this.listTime = ['jour', 'semaine', 'mois', 'année'];
    this.timeUnit = 'jour';
    graph.timeValue = 86400;

    graph.firstZoom = false;

    var getTimestamp = function(timeUnit){
      var now = moment().unix();
      switch(timeUnit){
        case 'jour':
          graph.timeValue =  86400;
          break;
        case 'semaine':
          graph.timeValue =  604800;
          break;
        case 'mois' :
          graph.timeValue =  2629743;
          break;
        case 'année':
          graph.timeValue =  31556926;
          break;
      }


      this.url += "&graph_start=" + (now - graph.timeValue) + "&graph_end=" + now;
    }


    var pointDown;
    var pointUp;

    this.mousedown = function($event){
      pointDown = $event.offsetX;
    }

    this.mouseup = function(){
      var pointUp = $event.offsetX;

      var width = $event.target.offsetWidth;

      var lastPx = (width * 11/100).toFixed(0) - 1;
      var nowPx = (width * 95/100).toFixed(0) - 1;
      var dist = nowPx - lastPx;

      if (graph.firstZoom){
        graph.timestampEnd = moment().unix();
        graph.tVal = graph.timeValue;
        graph.firstZoom = false;
      }


      var distPointDown = nowPx - pointDown;
      var distPointUp = nowPx - pointUp;
      var graphStart = graph.timestampEnd - (distPointDown * graph.tVal / dist).toFixed(0);
      var graphEnd = graph.timestampEnd - (distPointUp * graph.tVal / dist).toFixed(0);

      if (graphStart < graphEnd)
        graph.url = graph.urlSave + "&graph_start=" + graphStart + "&graph_end=" + graphEnd;
      else {
          graph.url = graph.urlSave + "&graph_start=" + graphEnd + "&graph_end=" + graphStart;
      }

      graph.timestampEnd = graphEnd;
      graph.tVal = graphEnd - graphStart;
    }



  }

}
