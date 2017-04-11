
'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, data, checkValueService){
  this.data = data;

}
