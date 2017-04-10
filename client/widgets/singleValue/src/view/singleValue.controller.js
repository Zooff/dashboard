'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController(data){
  this.data = data;
}
