angular.module('dashboardInfra')

.directive('showsql', function(utils){
  return {
    restrict : 'E',
    scope : {
      type : '@',
      config : '='
    },
    link : function(scope, el){
      console.log(scope)
      scope.str = "";
      scope.display = false;

      scope.constructSql = function(){
        scope.display = !scope.display;
        if (scope.config.condition2.length){
           var test = utils.computed(scope.config.condition.group) + utils.computed(scope.config.condition2.group);
        }
        else {
          var test = utils.computed(scope.config.condition.group);
        }
        // console.log(scope.req)
        switch (scope.type) {
          case 'data':
            scope.str = "SELECT * FROM " + scope.config.databaseStandard + " WHERE " + test ;
            break;
          case 'pie' :
            scope.str = "SELECT " + scope.config.columnStandard.name + " FROM " + scope.config.databaseStandard + " WHERE " + test + " GROUP BY " + scope.config.columnStandard.name + " ORDER BY 2 DESC";
            break;
          default:
            scope.str = "Error Type not define";
            break;
        }
      }

    },
    templateUrl : '/templates/directive/showSql.html'
  }
})
