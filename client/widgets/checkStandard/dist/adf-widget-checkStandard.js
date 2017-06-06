(function(window, undefined) {'use strict';


angular.module('adf.widget.checkStandard', ['adf.provider'])
  .config(checkStandardWidget);

function checkStandardWidget(dashboardProvider){
  dashboardProvider
    .widget('checkStandard', {
      title: 'Check Perso',
      description: 'Widget permettant la création de Check personalisé',
      templateUrl: '{widgetsPath}/checkStandard/src/view/view.html',
      controller: 'checkStandardController',
      controllerAs: 'cs',
      reload: true,
      resolve: {
        data: ["checkStandardService", "config", function(checkStandardService, config){
          return checkStandardService.get(config);
        }]
      },
      edit: {
        controller: 'checkStandardEditController',
        controllerAs: 'cs',
        templateUrl: '{widgetsPath}/checkStandard/src/edit/edit.html'
      }
    });
}
checkStandardWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.checkStandard").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/checkStandard/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><div class=form-group><label for=tooltip>Description</label> <input id=tooltip type=text class=form-control ng-model=config.tooltip placeholder=\"Entrer une description du check\"></div><form role=form><hr><input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in cs.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=cs.getColumns(config.databaseStandard)></div><div class=form-group><label for=standardTest>Test</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>REF</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>SEC</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database uib-typeahead=\"database for database in cs.getDatabaseExpert($viewValue)\" typeahead-min-length=0></div><div class=form-group><label class=sr-only for=query>Query</label> <textarea rows=3 id=query class=form-control placeholder=Query ng-model=config.expert></textarea></div></div><hr><div class=form-group><label>Seuil</label></div><div class=\"form-inline padding-bottom\"><select ng-model=config.seuil.op class=form-control><option value=\"=\" selected>Egal</option><option value=\">\">Superieur</option><option value=\"<\">Inferieur</option></select><input type=text ng-model=config.seuil.value class=form-control placeholder=\"Valeur du seuil\"></div><div class=form-group><label ng-click=\"isCollapsed = !isCollapsed\">Paramètre Tableau <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><p>Ce tableau s\'affiche lorsque vous cliquer sur le widget, il contient des informations plus détaillé sur le résultat du check. La première configuration est automatique</p><div><label>Column</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"col in cs.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=\"cs.removeColumn(false, $index)\"><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=cs.addColumn(false)><i class=\"fa fa-plus\"></i> Add</button></div></form>");
$templateCache.put("{widgetsPath}/checkStandard/src/view/modal.html","<div class=modal-header><button type=button class=close ng-click=$dismiss() aria-hidden=true>&times;</button><h3 class=modal-title id=modal-title>Title</h3></div><div class=modal-body id=modal-body><modal-table data=cm.data></modal-table></div>");
$templateCache.put("{widgetsPath}/checkStandard/src/view/view.html","<div><div ng-hide=cs.data class=\"alert alert-info\" role=alert>Please configure the widget</div><div class=text-center ng-show=cs.data ng-click=cs.open()><i ng-show=cs.data.positif class=\"fa fa-check fa-4x text-success\" aria-hidden=true>{{cs.data.data.length}}</i> <i ng-hide=cs.data.positif class=\"fa fa-times fa-4x text-danger\" aria-hidden=true>{{cs.data.data.length}}</i><p uib-tooltip={{cs.data.config.tooltip}} tooltip-placement=bottom>{{cs.small}}</p></div></div>");}]);


angular.module('adf.widget.checkStandard')
  .service('modalServiceCS', modalService);

function  modalService($q, $http, $parse){

  function createColumns(config, model){
    var columns = [];


    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        var title = col.title.replace(/_/, ' ');
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

  // function fetch(config){
  //   return $http.get(config.modalUrl)
  //     .then(function(response){
  //       return response.data;
  //     })
  //     .then(function(data){
  //       return createDataModel(config, data);
  //     });
  // }
  //
  // function get(config){
  //   console.log(config)
  //   var result = null;
  //   if (config){
  //     result = createDataModel(config.config, config.data);
  //   }
  //   return result;
  // }

  return {createDataModel : createDataModel};

}
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.checkStandard')
  .controller('modalInstanceCtrlCS', modalInstanceCtrl);


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




angular.module('adf.widget.checkStandard')
  .controller('checkStandardController', checkStandardController);

function checkStandardController($uibModal, data){
  if (data){
    var cs = this;

    if (data.config.tooltip){
      this.small = data.config.tooltip.substr(0, 15);
      if (data.config.tooltip.length > 15)
        this.small += '...';
    }
    this.data = data;

    if (this.data.config.seuil){
      if (data.config.seuil.op === '>'){
        this.data.positif = (this.data.data.length > this.data.config.seuil.value);
        console.log(this.data.positif)
      }

      if (data.config.seuil.op === '<'){
        this.data.positif = (this.data.data.length < this.data.config.seuil.value);
      }

      if (data.config.seuil.op === '='){
        this.data.positif = (this.data.data.length == this.data.config.seuil.value);
      }
    }

    // Open the modal which list the Array
    this.open = function(){
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkStandard/src/view/modal.html',
        controller : 'modalInstanceCtrlCS',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServiceCS', function(modalService){
            return modalService.createDataModel(cs.data.config, cs.data.data);
          }]
        }
      });
    }
  }

}
checkStandardController.$inject = ["$uibModal", "data"];



angular.module('adf.widget.checkStandard')
  .controller('checkStandardEditController', checkStandardEditController);

function checkStandardEditController($rootScope, $scope,$http, config, checkStandardService){
  var cs = this;
  this.config = config;
  if (!cs.config.principalCol)
    cs.config.principalCol = [];
  if(!cs.config.otherCol)
    cs.config.otherCol = [];
  // Init selecttree object
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
        cs.config.principalCol.push(el)
      }
      else {
        cs.config.otherCol.push(el);
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

  // load the array of columns
  function getColumns(standard){
    if (!standard && !config.columns){
      config.columns = [];
    }
    if (standard && !config.test){
      config.test = [];
    }
    return standard ? config.test : config.columns;
  }

  this.addColumn = function(standard){
    getColumns(standard).push({});
  };

  this.removeColumn = function(standard, index){
    getColumns(standard).splice(index, 1);
  };
}
checkStandardEditController.$inject = ["$rootScope", "$scope", "$http", "config", "checkStandardService"];



angular.module('adf.widget.checkStandard')
  .service('checkStandardService', checkStandardService);

function checkStandardService($q, $http, $parse){

  var apiEndPoint ='/standard';
  var expertUrl = '/expert/query';

  function createData(jsonData, config){
    return {config: config, data : jsonData};
  }

  function fetch(config){
    var data = {
      database : config.databaseStandard,
      test : config.condition,
      test2 : config.condition2
    };
    return $http.post(apiEndPoint, data)
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
    else if (config.databaseStandard){
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
checkStandardService.$inject = ["$q", "$http", "$parse"];
})(window);