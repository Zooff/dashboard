'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableEditController', paginateTableEditController);

function paginateTableEditController($scope, $http,config){
  this.config = config;

  // Use by the directive selecttree, need to be initialize
  config.datasource = {};
  config.modalDatasource = {};

  // $scope.getAutocompletion = function(val){
  //   return $http.get('/autocomplete', {
  //     params: {
  //       val : val
  //     }
  //   })
  //   .then(function(response){
  //     return response.data;
  //   });
  // }

  // GET the Database available for the expert Mode
  this.getDatabase = function(){
    return $http.get('/expert')
      .then(function(response){
        return response.data;
      });
  }

  function getColumns(modal){
    if (!modal && !config.columns){
      config.columns = [];
    }
    if (modal && !config.modalColumns){
      config.modalColumns = [];
    }

    return modal ? config.modalColumns : config.columns;
  }

  this.addColumn = function(modal){
    getColumns(modal).push({});
  };

  this.removeColumn = function(modal,index){
    getColumns(modal).splice(index, 1);
  };
}
