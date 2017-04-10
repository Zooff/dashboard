angular.module('dashboardInfra')

.controller('testCtrl', function($scope){

  $scope.beerU = [];
  $scope.beerUser = [];
  $scope.beerValue = [];

  $scope.addBeer = function(data,id){
  data[id].beer++;
  $scope.beerValue[id] = data[id].beer;
  }

  $scope.removeBeer = function(data,id){
    if (data[id].beer >= 1){
      data[id].beer--;
    }
    $scope.beerValue[id] = data[id].beer;
  }

  $scope.addUser = function(data){
    $scope.beerU.push({user: data, beer: 1});
    $scope.beerUser.push(data);
    $scope.beerValue.push(1);
    console.log($scope.beerU);
  }
})
