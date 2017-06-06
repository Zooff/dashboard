angular.module('dashboardInfra')

.directive('queryBuilder', ['$compile', '$http', function ($compile, $http) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            fields: '=',
            database: '='
        },
        templateUrl: '/templates/directive/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.conditions = [
                    { name: '=' },
                    { name: '<>' },
                    { name: '<' },
                    { name: '<=' },
                    { name: '>' },
                    { name: '>=' },
                    { name: 'contient'},
                    { name: 'entre'}
                ];

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '=',
                        field: '',
                        data: null
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'OR',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                scope.getColValue = function(col){
                  return $http.get('/standard/colvalue',{
                    params : {
                      database : database,
                      column : col
                    }
                  })
                  .then(function(response){
                   return response.data;
                  })

                }

                directive || (directive = $compile(content));
                element.append(directive(scope, function ($compile) {

                    return $compile;
                }));
            }
        }
    }
}]);
