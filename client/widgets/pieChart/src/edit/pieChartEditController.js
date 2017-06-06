'use strict';

angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, $http, config, pieChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  if (!graph.config.principalCol)
    graph.config.principalCol = [];
  if(!graph.config.otherCol)
    graph.config.otherCol = [];
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
        graph.config.principalCol.push(el)
      }
      else {
        graph.config.otherCol.push(el);
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
      getRefColumn(data);
      graph.column = data;
    });
  }
}
