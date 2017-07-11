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

angular.module("adf.widget.checkValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/checkValue/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><input type=radio ng-model=config.mode value=easy id=std> <label for=std>Mode Facile</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><div><label>Donnée Principal</label></div><div><div class=form-group><label for=tooltip>Description</label> <input id=tooltip type=text class=form-control ng-model=config.desc placeholder=Tooltips></div><div class=form-group><label class=sr-only for=sample>Donnée</label> <input type=text class=form-control ng-model=config.root placeholder=\"Enter name of principal data\" uib-typeahead=\"key for key in config.keys\" typeahead-min-length=0 autocomplete=off></div></div><div><label>Test</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=op>Operation</label><select class=form-group id=op ng-model=config.op required><option value=eq>==</option><option value=sup>></option><option value=inf><</option><option value=dif>!=</option><option value=not>not</option></select></div><div class=form-group><label class=sr-only for=test>Value</label> <input type=text id=test class=form-control placeholder=\"Test Value\" ng-model=config.test required></div></div><div><input type=checkbox ng-model=config.pourcent> <label>Pourcentage</label></div><div ng-if=config.pourcent><label class=sr-only for=sample>Donnée</label> <input type=text class=form-control ng-model=config.percentData placeholder=\"Enter name of principal data\" uib-typeahead=\"key for key in config.keys\" typeahead-min-length=0 autocomplete=off></div><div class=form-group><label ng-click=\"isCollapsed = !isCollapsed\">Paramètre Modal <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><div><label for=sample>Modal URL</label> <input type=text class=form-control ng-model=config.modalUrl placeholder=\"Modal Url\" uib-typeahead=\"address.url as address.url for address in getAutocompletion($viewValue)\" typeahead-template-url=autocomplete.html typeahead-loading=load typeahead-no-result=noResults></div><div><label>Column</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in cv.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=\"cv.removeColumn(false, $index)\"><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=cv.addColumn(false)><i class=\"fa fa-plus\"></i> Add</button></div><input type=checkbox ng-model=config.listener> listener</form>");
$templateCache.put("{widgetsPath}/checkValue/src/edit/standard.html","<div class=form-group><label for=sample>Liste des Datasources</label><div class=\"form-inline padding-bottom\" ng-repeat=\"url in cv.config.datasources\"><div class=form-group><label class=sr-only for=datasource-{{$index}}>Datasource</label> <input type=text id=datasource-{{$index}} class=form-control ng-model=url.name placeholder=Datasource uib-typeahead=\"address.url as address.url for address in getAutocompletion($viewValue)\" typeahead-template-url=autocomplete.html typeahead-loading=load typeahead-no-result=noResults></div><button type=button class=\"btn btn-warning\" ng-click=cv.removeColumn(true,$index)><i class=\"fa fa-minus\"></i> Remove</button></div></div><button type=button class=\"btn btn-primary\" ng-click=cv.addColumn(true)><i class=\"fa fa-plus\"></i> Add</button><div class=form-group><label for=standardTest>Test</label><select class=form-control><option></option></select></div>");
$templateCache.put("{widgetsPath}/checkValue/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/checkValue/src/view/view.html","<div><div ng-hide=cv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=cv.data ng-click=cv.open()><div ng-if=!cv.data.config.pourcent><div class=text-center><div><i ng-show=cv.data.ok class=\"fa fa-check fa-4x text-success\" aria-hidden=true>{{cv.data.data}}</i> <i ng-hide=cv.data.ok class=\"fa fa-times fa-4x text-danger\" aria-hidden=true>{{cv.data.data}}</i></div><p uib-tooltip={{cv.data.config.tooltip}} tooltip-placement=bottom>{{cv.data.config.desc}} : {{cv.data.data}}</p></div></div><div ng-if=cv.data.config.pourcent><div class=row><div class=\"text-center bdr-right col-md-8\"><h1 class=no-margin>{{cv.data.data}}</h1><small>{{cv.data.config.desc}}</small></div><div class=\"col-md-4 align-middle text-center\"><div ng-if=!cv.data.zero class=\"align-middle text-center\" uib-tooltip={{sv.data.lastWeek}}><span ng-if=\"cv.data.ok && cv.data.positif\" class=text-success><i class=\"fa fa-caret-up fa-2x text-success\" aria-hidden=true>{{cv.data.percentData}}</i> %</span> <span ng-if=\"!cv.data.ok && !cv.data.positif\" class=text-danger><i class=\"fa fa-caret-down fa-2x\" aria-hidden=true>{{cv.data.percentData}}</i> %</span> <span ng-if=\"!cv.data.ok && cv.data.positif\" class=text-danger><i class=\"fa fa-caret-up fa-2x\" aria-hidden=true>{{cv.data.percentData}}</i> %</span> <span ng-if=\"cv.data.ok && !cv.data.positif\" class=text-success><i class=\"fa fa-caret-down fa-2x\" aria-hidden=true>{{cv.data.percentData}}</i> %</span></div><span ng-if=cv.data.zero class=\"text-warning text-center align-middle\"><i class=\"fa fa-caret-right fa-2x\" aria-hidden=true>{{cv.data.percentData}}</i> <small>%</small></span><p class=text-center uib-tooltip={{cv.data.config.tooltip}} tooltip-placement=bottom>{{cv.data.config.descPercent}}</p></div></div></div><p ng-show=cv.datTest>{{cv.datTest}}</p></div></div>");}]);


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

    console.log(data)

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

    config.keys = [];
    for(var key in jsonData){
      config.keys.push(key);
    }


    if (!config.root)
      config.root = config.keys[1];

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

    if (!config.percentData){
      config.percentData = config.keys[0];
    }
    var percentData = $parse(config.percentData)(jsonData);

    if (!config.lastWeek){
      config.lastWeek = config.keys[2];
    }

    var lastWeek = $parse(config.lastWeek)(jsonData);

    return {config: config, data: data, ok: ok, percentData : percentData, lastWeek : lastWeek};
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