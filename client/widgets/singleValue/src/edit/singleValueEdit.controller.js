'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueEditController', singleValueEditController);

function singleValueEditController(config){
  this.config = config;

  function getColumns(){
    if (!config.columns){
      config.columns = [];
    }
    return config.columns;
  }

  this.addColumn = function(){
    getColumns().push({});
  };

  this.removeColumn = function(index){
    getColumns().splice(index, 1);
  };
}
