angular.module('dashboardInfra')

.directive('modalConfig', ['$http', function($http){
  return {
    restrict : 'E',
    scope : {
      config : '=',
    },
    link : function(scope, el){
      scope.config.datasource = {};
      var getColumns = function(){
        if (!scope.config.columns){
          scope.config.columns = [];
        }
        return scope.config.columns;
      }

      scope.addColumn = function(){
        getColumns().push({});
      };

      scope.removeColumn = function(index){
        getColumns().splice(index, 1);
      };

    },
    templateUrl : '/templates/directive/modalConfig.html'
  }
}]);
