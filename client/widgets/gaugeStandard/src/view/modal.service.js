'use strict';

angular.module('adf.widget.gaugeStandard')
  .service('modalServiceGC', modalService);

function  modalService($q, $http, $parse){

  function createColumns(config, model){
    var columns = [];


    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        var title = col.title.replace(/_/, ' ');
        title = title.replace(/^bool/, '');
        model.headers[i] = col.title;
        columns.push({
          title: col.title,
          path: $parse(col.path)
        });
      }
    });

    return columns;
  }

  function createDataModel(config, data){
    var model = {
      headers: [],
      rows: [],
    };
    if (!config.columns){
        config.columns = [];
        for (var key in data[0]){
          config.columns.push({title : key, path : key});
        }
    }

    var root = data;
    if (config.rootData){
      root = $parse(config.rootData)(data);
    }

    var columns = createColumns(config, model);
    angular.forEach(root, function(node){
      var row = [];

      angular.forEach(columns, function(col, i){
        var value = col.path(node);
        row[i] = value;
      });

      model.rows.push(row);
    });
    model.totalItems = model.rows.length;
    model.columns = config.columns;
    config.condition.group.rules.pop();
    return model;
  }

  function fetch(config){
    return $http.post('/standard', config)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }
  //
  // function get(config){
  //   console.log(config)
  //   var result = null;
  //   if (config){
  //     result = createDataModel(config.config, config.data);
  //   }
  //   return result;
  // }

  return {fetch : fetch};

}
