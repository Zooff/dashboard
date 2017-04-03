angular.module('dashboardInfra')

.controller('testCtrl', function($scope){

  $scope.beerU = [];

  $scope.addBeer = function(data,id){
  data[id].beer++;
  }

  $scope.removeBeer = function(data,id){
    if (data[id].beer >= 1)
      data[id].beer--;
  }

  $scope.addUser = function(data){
    $scope.beerU.push({user: data, beer: 1});
    console.log($scope.beerU);
  }
})
