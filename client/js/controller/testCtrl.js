angular.module('dashboardInfra')

.controller('testCtrl', function($scope){
  $scope.addBeer = function(){
    alert('Beer + 1');
  }

  $scope.removeBeer = function(){
    alert('Beer - 1');
  }
})
