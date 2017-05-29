'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardEditController', checkStandardEditController);

function checkStandardEditController($rootScope, $scope,$http, config, checkStandardService){
  var cs = this;
  this.config = config;
  // Init selecttree object
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};


  this.getDatabaseExpert = function(){
    return $http.get('/expert')
    .then(function(response){
      return response.data;
    });
  }

  this.getDatabase = function(){
    return $http.get('/standard')
      .then(function(response){
        return response.data;
      });
  }

  this.getColumns = function(val){
    return $http.get('/standard/columns', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    }).then(function(data){
      config.colDatabase = data;
    });
  }

  // load the array of columns
  function getColumns(standard){
    if (!standard && !config.columns){
      config.columns = [];
    }
    if (standard && !config.test){
      config.test = [];
    }
    return standard ? config.test : config.columns;
  }

  this.addColumn = function(standard){
    getColumns(standard).push({});
  };

  this.removeColumn = function(standard, index){
    getColumns(standard).splice(index, 1);
  };
}
