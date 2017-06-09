angular.module('dashboardInfra')

.directive('expertMode', ['$http', function($http){
  return {
    restrict : 'E',
    scope : {
      config : '=',
    },
    link : function(scope, el){
      scope.getDatabaseExpert = function(){
        return $http.get('/expert')
          .then(function(response){
            return response.data;
          });
      }
    },
    templateUrl : '/templates/directive/expertMode.html'
  }
}]);
