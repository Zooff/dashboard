'use strict';

angular.module('adf.widget.beerCounter')
  .controller('beerEditController', beerEditController);

function beerEditController($scope, config, beerService){
  this.config = config;

  $scope.addUser = function(name){
    beerService.addUser(name);
  }
}
