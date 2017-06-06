'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardEditController', checkStandardEditController);

function checkStandardEditController($rootScope, $scope,$http, config, checkStandardService){
  var cs = this;
  this.config = config;
  if (!cs.config.principalCol)
    cs.config.principalCol = [];
  if(!cs.config.otherCol)
    cs.config.otherCol = [];
  // Init selecttree object
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};

  if(!config.condition2)
    config.condition2 = {'group' : {'operator' : 'AND', 'rules' : []}};


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

  function getRefColumn(arrayCol){
    arrayCol.forEach(function(el){
      if(el.type == 'principal'){
        cs.config.principalCol.push(el)
      }
      else {
        cs.config.otherCol.push(el);
      }
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
      console.log(data);
      getRefColumn(data);
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
