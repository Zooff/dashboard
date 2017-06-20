angular.module('dashboardInfra')

.directive('modalTable', function($location){
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

      scope.getData = function(){
        return scope.data.rows;
      }

      scope.getHeader = function(){
        return scope.data.headers;
      }

      scope.goToMasterPage = function(scope, $event){
        // To close the modal, we need to go back to the parent who has the dismiss fct
        this.$parent.$parent.$parent.$dismiss();
        var id= $event.target.textContent;
        $location.path('/boards/master/' + id);

      }
    },
    templateUrl : '/templates/directive/modalTable.html'
  }
})
