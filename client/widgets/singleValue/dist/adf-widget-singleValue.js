(function(window, undefined) {'use strict';


angular.module('adf.widget.singleValue', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('singleValue', {
      title: 'Affichage Simple',
      description: 'Affiche une donnée',
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

angular.module("adf.widget.singleValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/singleValue/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div class=form-group><label for=sample>Datasource</label><div ng-show=config.url class=\"alert alert-info text-center\">{{config.url}}</div><selecttree model=config.datasource></selecttree></div><input type=checkbox ng-model=config.listener> <label>Slave</label><div><label>Principal Data</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Entrer la description de la donnée\"></div><div class=form-group><label class=sr-only for=sample>Principal Data</label><select ng-model=config.root class=form-control><option ng-repeat=\"el in config.list\" value={{el}}>{{el}}</option></select></div></div><div ng-if=!config.listener><div><label>Additional Data</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in sv.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=sv.removeColumn($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=sv.addColumn()><i class=\"fa fa-plus\"></i> Add</button></div><div><input id=cbe type=checkbox ng-model=expert> <label for=cbe>Expert Mode</label></div><div ng-show=expert><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database uib-typeahead=\"database for database in sv.getDatabase($viewValue)\" typeahead-min-length=0></div><div class=form-group><label class=sr-only for=query>Query</label> <textarea rows=3 id=query class=form-control placeholder=Query ng-model=config.expert></textarea></div></div></form>");
$templateCache.put("{widgetsPath}/singleValue/src/view/view.html","<div><div ng-hide=sv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=!sv.data.load><div class=\"text-center col-md-12\"><p>{{sv.data.config.urlReplace}}</p><h1 style=\"word-wrap: break-word\">{{sv.data.principalData.data}}</h1><p class=\"text-center small\">{{sv.data.principalData.desc}}</p></div><ul class=\"list-inline text-center\"><li ng-repeat=\"addData in sv.data.additionalData\">{{addData.title}} : {{addData.data}}</li></ul></div><div ng-hide=!sv.data.load class=text-center><i class=\"fa fa-spinner fa-pulse fa-3x\" aria-hidden=true></i></div></div>");}]);


angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController($rootScope, $scope, $timeout, data, singleValueService){
  if (data){
    var sv = this;
    this.data = data;

    //  When an event occur from the master widget
    if (sv.data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        sv.data.config.urlReplace = args;
        sv.data.load = true;
        // Reload the widget
        singleValueService.get(sv.data.config).then(function(response){
          sv.data.load = false;
          sv.data = response; // Bind the result in the model
        });
      });
    }
  }
}
singleValueController.$inject = ["$rootScope", "$scope", "$timeout", "data", "singleValueService"];



angular.module('adf.widget.singleValue')
  .controller('singleValueEditController', singleValueEditController);

function singleValueEditController($scope, $http, config){
  this.config = config;
  config.datasource = {};

  this.getDatabase = function(){
    return $http.get('/expert')
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
singleValueEditController.$inject = ["$scope", "$http", "config"];



angular.module('adf.widget.singleValue')
  .service('singleValueService', singleValueService);

function singleValueService($q, $http, $parse){

  function createColumns(config){
    var expertUrl = "/expert/query";
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
      config: config,
      principalData: {},
      additionalData: []
    };
    config.list = [];
    for (var key in data){
      config.list.push(key);
    }
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
    var url = config.url.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data[0]);
      });
  }

  function get(config){
    var result = null;
    if (config.expert){
      result = post(config);
    }
    else if (config.datasource){
      if(config.datasource.selected)
        config.url = config.datasource.selected.url;
      result = fetch(config);
    }
    return result;
  }

  function post(config){
    return $http.post(expertUrl, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createData(data[0], config);
      });
  }

  return {
    get: get
  };
}
singleValueService.$inject = ["$q", "$http", "$parse"];
})(window);