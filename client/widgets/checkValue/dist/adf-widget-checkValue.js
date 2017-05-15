(function(window, undefined) {'use strict';


angular.module('adf.widget.checkValue', ['adf.provider'])
  .config(checkValueWidget);

function checkValueWidget(dashboardProvider){
  dashboardProvider
    .widget('checkValue', {
      title: 'checkValue',
      description: 'Widgets permettant la création de Check',
      templateUrl: '{widgetsPath}/checkValue/src/view/view.html',
      controller: 'checkValueController',
      controllerAs: 'cv',
      reload: true,
      resolve: {
        data: ["checkValueService", "config", function(checkValueService, config){
          return checkValueService.get(config);
        }]
      },
      edit: {
        controller: 'checkValueEditController',
        controllerAs: 'cv',
        templateUrl: '{widgetsPath}/checkValue/src/edit/edit.html'
      }
    });
}
checkValueWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.checkValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/checkValue/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><div class=form-group><label for=tooltip>Description</label> <input id=tooltip type=text class=form-control ng-model=config.tooltip placeholder=Tooltips></div><input type=checkbox ng-model=standard> <label>Mode Standard</label><form role=form><div ng-if=standard ng-include=\"\'{widgetsPath}/checkValue/src/edit/standard.html\'\"></div><div ng-if=!standard><div class=form-group><label for=sample>Datasource</label> <input type=text class=form-control ng-model=config.url ng-blur=cv.load() placeholder=\"Enter url\" uib-typeahead=\"address.url as address.url for address in getAutocompletion($viewValue)\" typeahead-template-url=autocomplete.html typeahead-loading=load typeahead-no-result=noResults></div><div><input type=checkbox ng-model=config.pourcent> <label>Pourcentage</label></div><div><label>Principal Data</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><div class=form-group><label class=sr-only for=sample>Principal Data</label> <input type=text class=form-control ng-model=config.root placeholder=\"Enter name of principal data\"></div></div><div><label>Test</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=op>Operation</label><select class=form-group id=op ng-model=config.op required><option value=eq>==</option><option value=sup>></option><option value=inf><</option><option value=dif>!=</option><option value=not>not</option></select></div><div class=form-group><label class=sr-only for=test>Value</label> <input type=text id=test class=form-control placeholder=\"Test Value\" ng-model=config.test required></div></div></div><div class=form-group><label ng-click=\"isCollapsed = !isCollapsed\">Paramètre Modal <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><div><label for=sample>Modal URL</label> <input type=text class=form-control ng-model=config.modalUrl placeholder=\"Modal Url\" uib-typeahead=\"address.url as address.url for address in getAutocompletion($viewValue)\" typeahead-template-url=autocomplete.html typeahead-loading=load typeahead-no-result=noResults></div><div><label>Column</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in cv.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=\"cv.removeColumn(false, $index)\"><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=cv.addColumn(false)><i class=\"fa fa-plus\"></i> Add</button></div><div class=form-group><label ng-click=\"isCollapsed2 = !isCollapsed2\">Données Aditionnel <span ng-hide=isCollapsed2 class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed2 class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed2><div class=\"form-inline padding-bottom\"><div><label class=sr-only>Description donnée principale</label> <input type=text class=form-control ng-model=config.descPrincipalData placeholder=\"Donnée Principale\"></div><div><label class=sr-only>Donnée Principale</label> <input type=text class=form-control ng-model=config.principalData placeholder=\"Donnée Principale\"></div></div><div><label>Column</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in cv.config.additionalData\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=cv.removeColumn($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=cv.addColumn()><i class=\"fa fa-plus\"></i> Add</button></div><input type=checkbox ng-model=config.listener> listener<div><input type=checkbox ng-model=expert> Expert Mode</div><div ng-show=expert><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database></div><div class=form-group><label class=sr-only for=query>Query</label> <textarea rows=3 id=query class=form-control placeholder=Query ng-model=config.expert></textarea></div></div></form>");
$templateCache.put("{widgetsPath}/checkValue/src/edit/standard.html","<div class=form-group><label for=sample>Liste des Datasources</label><div class=\"form-inline padding-bottom\" ng-repeat=\"url in cv.config.datasources\"><div class=form-group><label class=sr-only for=datasource-{{$index}}>Datasource</label> <input type=text id=datasource-{{$index}} class=form-control ng-model=url.name placeholder=Datasource uib-typeahead=\"address.url as address.url for address in getAutocompletion($viewValue)\" typeahead-template-url=autocomplete.html typeahead-loading=load typeahead-no-result=noResults></div><button type=button class=\"btn btn-warning\" ng-click=cv.removeColumn(true,$index)><i class=\"fa fa-minus\"></i> Remove</button></div></div><button type=button class=\"btn btn-primary\" ng-click=cv.addColumn(true)><i class=\"fa fa-plus\"></i> Add</button><div class=form-group><label for=standardTest>Test</label><select class=form-control><option></option></select></div>");
$templateCache.put("{widgetsPath}/checkValue/src/view/modal.html","<div class=modal-header><h3 class=modal-title id=modal-title>Title</h3></div><div class=modal-body id=modal-body>{{cm.un}}<table class=table><tr><th ng-repeat=\"head in cm.data.headers\" ng-click=cm.sortIndex($index)>{{head}}</th></tr><tr ng-repeat=\"row in cm.data.rows| orderBy:cm.sorter:cm.reverseSort track by $index\"><td ng-repeat=\"col in row track by $index\">{{col}}</td></tr></table></div>");
$templateCache.put("{widgetsPath}/checkValue/src/view/view.html","<div><div ng-hide=cv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=cv.data ng-click=cv.open()><div ng-if=!cv.data.config.pourcent><div class=text-center><div><i ng-show=cv.data.ok class=\"fa fa-check fa-4x text-success\" aria-hidden=true>{{cv.data.principalData}}</i> <i ng-hide=cv.data.ok class=\"fa fa-times fa-4x text-danger\" aria-hidden=true>{{cv.data.principalData}}</i></div><p uib-tooltip={{cv.data.config.tooltip}} tooltip-placement=bottom>{{cv.data.config.desc}} : {{cv.data.data}}</p></div></div><div ng-if=cv.data.config.pourcent><div class=text-center><div ng-if=!cv.data.zero class=align-middle><i ng-if=\"cv.data.ok && cv.data.positif\" class=\"fa fa-caret-up fa-5x text-success\" aria-hidden=true>{{cv.data.principalData}}</i> <i ng-if=\"!cv.data.ok && !cv.data.positif\" class=\"fa fa-caret-down fa-5x text-danger\" aria-hidden=true>{{cv.data.principalData}}</i> <i ng-if=\"!cv.data.ok && cv.data.positif\" class=\"fa fa-caret-up fa-5x text-danger\" aria-hidden=true>{{cv.data.principalData}}</i> <i ng-if=\"cv.data.ok && !cv.data.positif\" class=\"fa fa-caret-down fa-5x text-success\" aria-hidden=true>{{cv.data.principalData}}</i></div><i ng-if=cv.data.zero class=\"fa fa-caret-right fa-5x text-warning\" aria-hidden=true>{{cv.data.principalData}}</i><p uib-tooltip={{cv.data.config.tooltip}} tooltip-placement=bottom>{{cv.data.config.desc}} : <span ng-show=\"!cv.data.zero && cv.data.ok\" class=text-success>{{cv.data.data}} %</span> <span ng-show=\"!cv.data.zero && !cv.data.ok\" class=text-danger>{{cv.data.data}} %</span> <span ng-show=cv.data.zero class=text-warning>{{cv.data.data}} %</span></p></div></div><p ng-show=cv.datTest>{{cv.datTest}}</p></div></div>");}]);


angular.module('adf.widget.checkValue')
  .service('modalService', modalService);

function  modalService($q, $http, $parse){

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
    return $http.get(config.modalUrl)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function get(config){
    var result = null;
    if (config.modalUrl){
      result = fetch(config);
    }
    return result
  }

  return {get : get};

}
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.checkValue')
  .controller('modalInstanceCtrl', modalInstanceCtrl);


  function modalInstanceCtrl(data){

    var cm = this;
    this.data = data;

    this.sortIndex = function(index){
      cm.reverseSort = !cm.reverseSort;
      return cm.orderField = index;
    }

    this.sorter = function(item){
      return item[cm.orderField];
    }

  }
  modalInstanceCtrl.$inject = ["data"];




angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, $uibModal, data, checkValueService){
  if (data){
    var cv = this;
    this.data = data;

    if (this.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        cv.datTest = args;
      });
    }

    this.configModal = cv.data.config;
    this.data.positif = data.data > 0;
    if (this.data.config.pourcent && this.data.data == 0)
      this.data.zero = true;


    // Open the modal which list the Array
    this.open = function(){
      if (!cv.data.config.modalUrl)
        return;
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkValue/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        resolve: {
          data: ['modalService', function(modalService){
            return modalService.get(cv.configModal);
          }]
        }
      });
    }
  }

}
checkValueController.$inject = ["$scope", "$uibModal", "data", "checkValueService"];



angular.module('adf.widget.checkValue')
  .controller('checkValueEditController', checkValueEditController);

function checkValueEditController($scope, $http, config, checkValueService){
  this.config = config;

  $scope.getAutocompletion = function(val){
    return $http.get('/api/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

  // load the array of columns
  function getColumns(standard){
    if (!standard && !config.columns){
      config.columns = [];
    }
    if (standard && !config.datasources){
      config.datasources = [];
    }
    return standard ? config.datasources : config.columns;
  }

  this.addColumn = function(standard){
    getColumns(standard).push({});
  };

  this.removeColumn = function(standard, index){
    getColumns(standard).splice(index, 1);
  };

  this.load = function(){
    checkValueService.get(config.url);
  }

}
checkValueEditController.$inject = ["$scope", "$http", "config", "checkValueService"];



angular.module('adf.widget.checkValue')
  .service('checkValueService', checkValueService);

function checkValueService($q, $http, $parse){

  function createData(jsonData, config){


    if (config.principalData){
      var principalData = $parse(config.principalData)(jsonData);
    }

    //
    var data = $parse(config.root)(jsonData);
    var ok = false;

    switch(config.op){
      case "eq":
        ok = (data == config.test);
        break;
      case "dif":
        ok = (data != config.test);
        break;
      case "sup":
        ok = (data > config.test);
        break;
      case "inf":
        ok = (data < config.test);
        break;
      default:
        ok = false;
    }

    return {config: config, data: data, ok: ok, principalData : principalData};
  }

  function fetch(config){
    return $http.get(config.url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createData(data, config);
      });
  }

  function get(config){
    var result = null;
    if (config.expert){
      result = post(config);
    }
    else if (config.url){
      result = fetch(config);
    }
    return result
  }

  function post(config){
    return $http.post(expertUrl, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createData(data, config);
      });
  }

  return {
    get: get
  };
}
checkValueService.$inject = ["$q", "$http", "$parse"];
})(window);