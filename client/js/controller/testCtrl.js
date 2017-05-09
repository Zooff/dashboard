angular.module('dashboardInfra.controller')

.controller('testCtrl', function($scope, Session, Auth){

  $scope.beerU = [];
  $scope.beerUser = [];
  $scope.beerValue = [];


  this.slides = [
    {value : 120, desc : 'value 0'},
    {value : 20, desc : 'value 1'},
    {value : 140, desc : 'value 2'},
    {value : 150, desc : 'value 3'},
    {value : 10, desc : 'une description super longue afin de tout casser et me faire plus galérer'},
    {value : 12, desc : 'value 5'},
  ];
  this.interval = 5000;
  this.nowrap = false;


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
  // var u = {userRole : 'guest'};
  // Session.create(u);

})
