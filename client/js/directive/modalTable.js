angular.module('dashboardInfra')

.directive('modalTable', function(){
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link : function(scope, el){
      scope.reverseSort = false;
      scope.orderField = 0;
      scope.itemPerPage = 10;
      scope.currentPage =1;

      scope.sortIndex = function(index){
        scope.reverseSort = !scope.reverseSort;
        return scope.orderField = index;
      }

      scope.sorter = function(item){
        return item[scope.orderField];
      }
    },
    templateUrl : '/js/directive/modalTable.html'
  }
})
