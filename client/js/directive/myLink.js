angular.module('dashboardInfra')

.directive('myLink', ['$http', function($http){
  return {
    restrict : 'E',
    scope : {
      config : '=',
    },
    link : function(scope, el){
      scope.getDash = function(){
        return $http.get('/dashboard/list')
          .then(function(response){
            return response.data
          })
      }

    },
    templateUrl : '/templates/directive/myLink.html'
  }
}]);
