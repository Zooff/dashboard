'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueEditController', singleValueEditController);

function singleValueEditController($scope, $http, config){
  this.config = config;
  config.datasource = {};

  this.getDatabase = function(){
    return $http.get('/expert')
      .then(function(response){
        return response.data;
      });
  }

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

  function getColToPop(){
    if (!config.colToPop)
      config.colToPop = [];
    return config.colToPop;
  };


  this.addColToPop = function(){
    getColToPop().push({});
  };

  this.removeColToPop = function(index){
    getColToPop().splice(index, 1)
  };

}
