'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableEditController', paginateTableEditController);

function paginateTableEditController($scope, $http,config){
  var pt = this;
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
  if (!pt.config.principalCol)
    pt.config.principalCol = [];
  if(!pt.config.otherCol)
    pt.config.otherCol = [];
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};
  if(!config.condition2)
    config.condition2 = {'group' : {'operator' : 'AND', 'rules' : []}};

  this.getDatabase = function(){
    return $http.get('/standard')
      .then(function(response){

        return response.data;
      });
  }

  function getRefColumn(arrayCol){
    pt.config.principalCol = [];
    pt.config.otherCol = [];
    arrayCol.forEach(function(el){
      if(el.type == 'principal'){
        pt.config.principalCol.push(el)
      }
      else {
        pt.config.otherCol.push(el);
      }
    });
  }

  this.getStandardColumns = function(val){
    return $http.get('/standard/columns', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    }).then(function(data){
      getRefColumn(data);
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
