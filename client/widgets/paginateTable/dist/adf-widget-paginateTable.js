(function(window, undefined) {'use strict';


angular.module('adf.widget.paginateTable', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('paginateTable', {
      title: 'paginateTable',
      description: 'Displays a table of data from a json url',
      templateUrl: '{widgetsPath}/paginateTable/src/view/view.html',
      controller: 'paginateTableController',
      controllerAs: 'pt',
      reload: true,
      resolve: {
        data: ["paginateTableService", "config", function(paginateTableService, config){
          return paginateTableService.get(config);
        }]
      },
      edit: {
        controller: 'paginateTableEditController',
        controllerAs: 'pt',
        templateUrl: '{widgetsPath}/paginateTable/src/edit/edit.html'
      }
    });
}
TableWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.paginateTable").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/paginateTable/src/edit/edit.html","<form role=form><div class=form-group><label for=sample>URL</label> <input type=text class=form-control ng-model=config.url placeholder=\"Enter url\" uib-typeahead=\"address for address in getAutocompletion($viewValue)\" typeahead-loading=load typeahead-no-result=\"noResults> </div> <div class=\" form-group\"> <label for=sample>Root element</label> <input type=text class=form-control ng-model=config.root placeholder=\"Enter name of root element\"></div><div><label>Columns</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in pt.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=pt.removeColumn($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=pt.addColumn()><i class=\"fa fa-plus\"></i> Add</button><div><label>Pagination</label></div><div class=form-group><label class=sr-only for=maxSize>Item par Page</label> <input type=text id=maxSize class=form-control placeholder=\"Item Per Page\" ng-model=config.itemPerPage></div></form>");
$templateCache.put("{widgetsPath}/paginateTable/src/view/view.html","<div><div ng-hide=pt.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=pt.data><table class=table><tr><th ng-repeat=\"head in pt.data.headers\" ng-click=pt.sortIndex($index)>{{head}}</th></tr><tr ng-repeat=\"row in filterData = (pt.data.rows | filter:q )| orderBy:pt.sorter:pt.reverseSort| startFrom: (pt.data.currentPage-1)*pt.data.itemPerPage | limitTo:pt.data.itemPerPage track by $index\"><td ng-repeat=\"col in row\">{{col}}</td></tr></table><div class=\"text-center col-md-3\"><input type=search ng-model=q placeholder=Filter class=form-control></div><div class=text-center><ul uib-pagination total-items=filterData.length ng-model=pt.data.currentPage max-size=pt.data.maxSize class=pagination-sm boundary-links=true items-per-page=pt.data.itemPerPage num-pages=numPages></ul></div></div></div>");}]);


angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController(data, $filter, $scope){

  var pt = this;

  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
    this.orderField = 0;
    console.log(this.orderField);
    this.reverseSort = false;

    // Change the orderBy header
    this.sortIndex = function(index){
      pt.reverseSort = !pt.reverseSort;
      return pt.orderField = index;
    }

    this.sorter = function(item){
      return item[pt.orderField];
    }
  }







  console.log(data)
}
paginateTableController.$inject = ["data", "$filter", "$scope"];



angular.module('adf.widget.paginateTable')
  .controller('paginateTableEditController', paginateTableEditController);

function paginateTableEditController($scope, $http,config){
  this.config = config;

  $scope.getAutocompletion = function(val){
    return $http.get('/api/servers/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

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
paginateTableEditController.$inject = ["$scope", "$http", "config"];



angular.module('adf.widget.paginateTable')
  .service('paginateTableService', paginateTableService);

function paginateTableService($q, $http, $parse){

  function createColumns(config, model){
    var columns = [];

    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
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
      itemPerPage : config.itemPerPage
    };

    var root = data;
    if (config.root){
      root = $parse(config.root)(data);
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
paginateTableService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.paginateTable')

.filter('startFrom', function(){
  return function(input, start){
    if (!input || !input.length) {return ;}
    return input.slice(start);
  }
})
})(window);