'use strict';

angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, $http, config, lineChartService){
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

  this.getDatabase = function(){
    return $http.get('/standard')
      .then(function(response){

        return response.data;
      });
  }

  function getRefColumn(arrayCol){
    graph.config.principalCol = [];
    graph.config.otherCol = [];
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
