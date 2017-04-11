
'use strict';

angular.module('adf.widget.beerCounter')
  .controller('beerController', beerController);

function beerController($scope, data, beerService){
  this.data = data.data;

  // Pie Chart Data
  this.user = data.user;
  this.value = data.value;


  $scope.addBeer = function(beerCount){
    beerService.addBeer(beerCount);
  }

  $scope.removeBeer = function(beerCount){
    beerService.removeBeer(beerCount);
  }
}
