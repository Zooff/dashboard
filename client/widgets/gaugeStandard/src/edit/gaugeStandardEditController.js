'use strict';

angular.module('adf.widget.gaugeStandard')
  .controller('gaugeStandardEditController', gaugeStandardEditController);

function gaugeStandardEditController($scope, $http, config, gaugeStandardService){
  var graph = this;
  this.config = config;
  // Init selecttree object
  config.datasource = {};

  if (!graph.config.principalCol)
    graph.config.principalCol = [];
  if(!graph.config.otherCol)
    graph.config.otherCol = [];
  // Init query Builder
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
      console.log(data);
      getRefColumn(data);
    });
  }


}
