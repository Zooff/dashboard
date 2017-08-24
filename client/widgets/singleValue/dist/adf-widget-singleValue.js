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

angular.module("adf.widget.singleValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/singleValue/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><input type=checkbox ng-model=config.listener> <label>Slave</label><div ng-if=config.listener><label>Master Column</label> <input type=text ng-model=config.slaveValue><hr></div><div><label>Donnée</label></div><div class=form-group><label class=sr-only for=sample>Principal Data</label><select ng-model=config.root class=form-control><option ng-repeat=\"el in config.list\" value={{el}}>{{el}}</option></select></div><div class=form-group><label for=desc>Label</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Entrer la description de la donnée\"></div><hr><label>Formatage</label><div><input id=percent type=radio ng-model=config.format value=percent> <label for=percent>Pourcentage</label> <input id=custom type=radio ng-model=config.format value=custom> <label for=custom>Custom</label></div><div ng-if=\"config.format == \'custom\'\"><div class=row><div class=col-md-6><label>Prefix</label> <input type=text ng-model=config.custom.prepend></div><div class=col-md-6><label>Suffixe</label> <input type=text ng-model=config.custom.append></div></div></div><label>Seuil</label><div class=\"form-inline padding-bottom\"><select ng-model=config.seuilOp><option value=Sup>Sup</option><option value=Inf>Inf</option><option value=Eg>Eg</option></select><input type=text ng-model=config.seuilVal></div><div><label ng-click=\"isCollapsed3 = !isCollapsed3\">Paramètre Optionnel <span ng-hide=isCollapsed3 class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed3 class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed3><div><label for=field>Column to populate</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"c in sv.config.colToPop\"><div class=form-group><input type=text id=field autocomplete=off uib-typeahead=\"key for key in config.list\" typeahead-min-length=0 ng-model=c.name></div><button type=button class=\"btn btn-warning\" ng-click=sv.removeColToPop($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=sv.addColToPop()><i class=\"fa fa-plus\"></i> Add</button><hr><my-link config=config></my-link><hr><div><label>Modal Configuration</label></div><modal-config config=config.modal></modal-config></div></form>");
$templateCache.put("{widgetsPath}/singleValue/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/singleValue/src/view/view.html","<div><div ng-hide=sv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=!sv.data.load><div class=\"text-center col-md-12\" ng-click=sv.open() ng-class=\"{click : sv.config.link || sv.config.modal}\"><h3 style=\"word-wrap: break-word\" ng-class=sv.getSeuilColor()><span ng-if=\"sv.data.config.format == \'custom\'\">{{sv.data.config.custom.prepend}}</span> {{sv.data.principalData.data}} <span ng-if=\"sv.data.config.format == \'percent\'\">%</span> <span ng-if=\"sv.data.config.format == \'custom\'\">{{sv.data.config.custom.append}}</span></h3><p class=\"text-center small\">{{sv.data.principalData.desc}}</p></div><ul class=\"list-inline text-center\"><li ng-repeat=\"addData in sv.data.additionalData\">{{addData.title}} : {{addData.data}}</li></ul></div><div ng-hide=!sv.data.load class=text-center><i class=\"fa fa-spinner fa-pulse fa-3x\" aria-hidden=true></i></div></div>");}]);


angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController($rootScope, $scope, $timeout, data, singleValueService, link){
  if (data){
    var sv = this;
    this.data = data;
    this.config = data.config

    sv.getSeuilColor = function(){
      if (sv.config.seuilOp == 'Sup'){
        return (sv.config.seuilVal > sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.config.seuilOp == 'Inf'){
        return (sv.config.seuilVal < sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.config.seuilOp == 'Eg'){
        return (sv.config.seuilVal == sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
    }


    //  When an event occur from the master widget
    if (sv.config.listener){
      $scope.$on('DatTest', function(events, args){
        sv.config.expertReplace = args;
        sv.config.urlReplace = args[sv.config.slaveValue];
        sv.data.load = true;
        // Reload the widget
        singleValueService.get(sv.data.config).then(function(response){
          sv.data.load = false;
          sv.data = response; // Bind the result in the model
        });
      });
    }

    sv.open = function(){
      if (!sv.config.modal && !sv.config.link){
        return;
      }

        if (sv.config.expertReplace){
          var broadcastEl = sv.config.expertReplace;
        }
        else {
          var broadcastEl = {};
        }

        if (sv.config.colToPop){
          sv.config.colToPop.forEach(function(el){
            broadcastEl[el.name] = data.jsondata[el.name];
          })
        }
        if (sv.config.master){
          $rootScope.$broadcast('DatTest', broadcastEl);
          return;
        }
        console.log('BUG')

        if (sv.config.link){
          link.redirect(sv.config, broadcastEl);
          return;
        }

        if (sv.config.modal){
          var modalInstance = $uibModal.open({
            templateUrl : '{widgetsPath}/singleValue/src/view/modal.html',
            controller : 'modalInstanceCtrl',
            controllerAs : 'cm',
            resolve: {
              data: ['modalServiceSV',function(modalServiceSV){
                return modalServiceSV.get(sv.config);
              }],
            }
          });
        }
    }
  }
}
singleValueController.$inject = ["$rootScope", "$scope", "$timeout", "data", "singleValueService", "link"];



angular.module('adf.widget.singleValue')
  .service('modalServiceSV', modalService);

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
    if (!config.columns || !config.columns.length){
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
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.singleValue')
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

  function getColToPop(){
    if (!config.colToPop)
      config.colToPop = [];
    return config.colToPop;
  };


  this.addColToPop = function(){
    getColToPop().push({});
  };

  this.removeColToPop = function(index){
    getColToPop().splice(index, 1)
  };

}
singleValueEditController.$inject = ["$scope", "$http", "config"];



angular.module('adf.widget.singleValue')
  .service('singleValueService', singleValueService);

function singleValueService($q, $http, $parse){
  var expertUrl = "/expert/query";

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
      config: config,
      principalData: {},
      additionalData: [],
      jsondata : data
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
        if (data.code){
          var principalData = {data : data.code};
          var model = {config : config, principalData : principalData1};
        }
        return createDataModel(config, data[0]);
      });
  }

  return {
    get: get
  };
}
singleValueService.$inject = ["$q", "$http", "$parse"];
})(window);