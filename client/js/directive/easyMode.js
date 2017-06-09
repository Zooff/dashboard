angular.module('dashboardInfra')

.directive('easyMode', ['$http', function($http){
  return {
    restrict : 'E',
    scope : {
      config : '=',
    },
    templateUrl : '/templates/directive/easyMode.html'
  }
}]);
