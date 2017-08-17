'use strict';

angular.module('adf.widget.pieChart')
  .service('modalServicePC', modalService);

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
    return model;
  }

  function fetch(config){
    console.log(config)
    var url = config.modal.url.replace(/:\w+/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createDataModel(config.modal, data)
      })
  }
  function post(config){
    var url = "/expert/query"
    config.modal.expertReplace = config.expertReplace;
    return $http.post(url, config.modal)
      .then(function(response){
        console.error(response)
        return response.data;
      })
      .then(function(data){
        return createDataModel(config.modal, data);
      });
  }
  //
  function get(config){
    var result = null;
    if (config.modal.modalMode == "exp"){
      result = post(config);
    }
    else if (config.modal.modalMode = "easy"){
      if (config.modal.datasource.selected)
        config.modal.url = config.modal.datasource.selected.url;
      result = fetch(config);
    }
    return result;
  }

  return {get : get};

}
