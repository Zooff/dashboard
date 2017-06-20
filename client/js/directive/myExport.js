angular.module('dashboardInfra')

.directive('myExport', function(){
  return {
    restrict : 'E',
    scope : {
      chart : '='
    },
    link: function(scope, el){
      scope.export = function($event){

        // IE
        if (scope.chart.chart.canvas.msToBlob){
          var blob = scope.chart.chart.canvas.msToBlob();
          window.navigator.msSaveBlob(blob, 'graph.png')
        }
        else {
          var img = scope.chart.toBase64Image();
          img = img.replace('image/png', 'image/octet-stream');
          $event.currentTarget.href = img;
          $event.currentTarget.download = 'graph.png';
        }
      }
    },
    templateUrl : '/templates/directive/myExport.html'
  }
})
