
'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, data, checkValueService){
  if (data){
  this.data = data;

  this.data.positif = data.data > 0;
  if (this.data.pourcent && this.data.data == 0)
    this.data.zero = true;
  }

}
