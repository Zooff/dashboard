(function(window, undefined) {'use strict';


angular.module('adf.widget.singleValue', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('singleValue', {
      title: 'singleValue',
      description: 'Displays a table of data from a json url',
      templateUrl: '{widgetsPath}/singleValue/src/view/view.html',
      controller: 'singleValueController',
      controllerAs: 'sv',
      reload: true,
      resolve: {
        data: ["singleValueService", "config", function(singleValueService, config){
          return singleValueService.get(config);
        }]
      },
      edit: {
        controller: 'singleValueEditController',
        controllerAs: 'sv',
        templateUrl: '{widgetsPath}/singleValue/src/edit/edit.html'
      }
    });
}
TableWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.singleValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/singleValue/src/edit/edit.html","<form role=form><div class=form-group><label for=sample>URL</label> <input type=text class=form-control ng-model=config.url placeholder=\"Enter url\"></div><div><label>Principal Data</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><div class=form-group><label class=sr-only for=sample>Principal Data</label> <input type=text class=form-control ng-model=config.root placeholder=\"Enter name of principal data\"></div></div><div><label>Additional Data</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in sv.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=sv.removeColumn($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=sv.addColumn()><i class=\"fa fa-plus\"></i> Add</button></form>");
$templateCache.put("{widgetsPath}/singleValue/src/view/view.html","<div><div ng-hide=sv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=sv.data><div><h1 class=text-center>{{sv.data.principalData.data}}</h1><p class=\"text-center small\">{{sv.data.principalData.desc}}</p></div><ul class=\"list-inline text-center\"><li ng-repeat=\"addData in sv.data.additionalData\">{{addData.title}} : {{addData.data}}</li></ul></div></div>");}]);


angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController(data){
  this.data = data;
}
singleValueController.$inject = ["data"];



angular.module('adf.widget.singleValue')
  .controller('singleValueEditController', singleValueEditController);

function singleValueEditController(config){
  this.config = config;

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
}
singleValueEditController.$inject = ["config"];



angular.module('adf.widget.singleValue')
  .service('singleValueService', singleValueService);

function singleValueService($q, $http, $parse){

  function createColumns(config){
    var columns = [];

    angular.forEach(config.columns, function(col, i){
      if (col.path) {
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
      principalData: {},
      additionalData: []
    };

    var root = data;
    if (config.root){
      var principalData = $parse(config.root)(data);
      model.principalData = {desc: config.desc, data: principalData};
    }

    var columns = createColumns(config);

    angular.forEach(columns, function(col, i){
      var value = col.path(data);
      model.additionalData.push({title: col.title, data: value});
    });

    return model;
  }

  function fetch(config){
    return $http.get(config.url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function get(config){
    var result = null;
    if (config.url){
      result = fetch(config);
    }
    return result;
  }

  return {
    get: get
  };
}
singleValueService.$inject = ["$q", "$http", "$parse"];
})(window);