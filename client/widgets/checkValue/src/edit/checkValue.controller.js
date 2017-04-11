'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueEditController', checkValueEditController);

function checkValueEditController($scope, config, checkValueService){
  this.config = config;

}
