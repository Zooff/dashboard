(function(window, undefined) {'use strict';


angular.module('adf.widget.gaugeChart', ['adf.provider', 'dashboardInfra.service'])
  .config(gaugeChartWidget);

function gaugeChartWidget(dashboardProvider){
  dashboardProvider
    .widget('gaugeChart', {
      title: 'Compteur',
      description: 'Widget permettant l\'affichage d\'un compteur',
      templateUrl: '{widgetsPath}/gaugeChart/src/view/view.html',
      controller: 'gaugeChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["gaugeChartService", "config", function(gaugeChartService, config){
          return gaugeChartService.get(config);
        }]
      },
      edit: {
        controller: 'gaugeChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/gaugeChart/src/edit/edit.html'
      }
    });
}
gaugeChartWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.gaugeChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/gaugeChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div><label>Description</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Configuration du Graph</label></div><input ng-if=\"config.mode == \'easy\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\'\" for=listener>Slave</label> <input type=checkbox id=master ng-model=config.master> <label for=master>Master</label><div ng-if=config.listener><label>Master Column</label> <input type=text ng-model=config.slaveValue></div><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=arch>Arch</option><option value=semi>Semi</option><option value=full>Full</option></select></div><div><label>Label (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><label for=append>Unité</label> <input type=text class=form-control id=append ng-model=config.append placeholder=\"GB, Mo, etc...\"> <label for=min>Valeur Minimum</label> <input type=text class=form-control id=min ng-model=config.min placeholder=0> <label for=max>Valeur Maximum</label> <input type=text class=form-control id=max ng-model=config.max placeholder=100> <label for=detail>Afficher les valeurs</label> <input type=checkbox ng-model=detail id=detail><div class=row ng-if=detail><div class=col-md-6><label class=ctm-label for=val>Valeur Actuelle</label> <input type=text id=val class=form-control ng-model=config.valDetail placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div class=col-md-6><label class=ctm-label for=max>Valeur Maximum</label> <input type=text id=max class=form-control ng-model=config.maxDetail placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div></div><div><label>Couleur</label></div><div class=row><div class=col-md-6><label class=ctm-label for=cfg>Remplissage</label><color-picker id=cfg ng-model=config.colorFg options=\"{required : false, format : \'rgb\'}\"></color-picker></div><div class=col-md-6><label class=ctm-label for=cbg>Background</label><color-picker id=cbg ng-model=config.colorBg options=\"{required : false, format : \'rgb\'}\"></color-picker></div></div><div><label ng-click=\"isCollapsed2 = !isCollapsed2\">Seuil <span ng-hide=isCollapsed2 class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed2 class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed2><div class=row ng-repeat=\"val in graph.config.seuil\"><div class=col-md-6><label class=ctm-label>Valeur Minimal</label> <input type=text ng-model=val.val></div><div class=col-md-6><label class=ctm-label>Couleur</label><color-picker ng-model=val.color options=\"{required : false, format : \'rgb\'}\"></color-picker></div><div><button type=button class=\"btn btn-warning\" ng-click=graph.removeSeuil($index)><i class=\"fa fa-minus\"></i> Remove</button></div><hr></div><button type=button class=\"btn btn-primary\" ng-click=graph.addSeuil()><i class=\"fa fa-plus\"></i> Add</button></div></div><div><label ng-click=\"isCollapsed3 = !isCollapsed3\">Paramètre Optionnel <span ng-hide=isCollapsed3 class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed3 class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed3><div><label for=field>Column to populate</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"c in graph.config.colToPop\"><div class=form-group><input type=text id=field autocomplete=off uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 ng-model=c.name></div><button type=button class=\"btn btn-warning\" ng-click=graph.removeColToPop($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=graph.addColToPop()><i class=\"fa fa-plus\"></i> Add</button><hr><my-link config=config></my-link><hr><div><label>Modal Configuration</label></div><modal-config config=config.modal></modal-config></div></form>");
$templateCache.put("{widgetsPath}/gaugeChart/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/gaugeChart/src/view/view.html","<div><div ng-hide=graph.value class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.value><div class=text-center><ng-gauge type={{graph.config.type}} thick=5 value=graph.value cap=round label={{graph.label}} append={{graph.config.append}} min=graph.config.min max=graph.config.max foreground-color={{graph.config.colorFg}} background-color={{graph.config.colorBg}} thresholds=graph.seuil ng-click=graph.open() ng-class=\"{click : graph.config.master || graph.config.modal}\"></ng-gauge></div><div class=text-center><p>{{graph.config.desc}}</p></div></div></div>");}]);


angular.module('adf.widget.gaugeChart')
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

angular.module('adf.widget.gaugeChart')
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




angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartController', gaugeChartController);

function gaugeChartController($scope, data, gaugeChartService, $rootScope, $uibModal, link){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.config.label;
    this.value = data.value;
    this.valDetail = data.valDetail;
    this.maxDetail = data.maxDetail;
    this.desc = data.desc;

    if(!graph.config.colorFg){
      graph.config.colorFg = "#009688"
    }

    if(!graph.config.colorBg){
      graph.config.colorBg = "rgba(0,0,0,0.1)";
    }


    if (graph.config.seuil){
      graph.seuil = {};
      graph.config.seuil.forEach(function(el){
        graph.seuil[el.val] = {color : el.color};
      })
    }

    if (graph.valDetail && graph.maxDetail){
      graph.label = graph.valDetail + " / " + graph.maxDetail;
    }
    console.log(graph.label)

    if (data.config.listener){
      $scope.$on('DatTest', function(events, args){
        graph.config.expertReplace = args;
        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        gaugeChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.valDetail = data.valDetail;
          graph.maxDetail = data.maxDetail;
        });
      });
    }

    graph.open = function(){
      if (!graph.config.master && !graph.config.modal && !graph.config.link){
        return;
      }

        if (graph.config.expertReplace){
          var broadcastEl = graph.config.expertReplace;
        }
        else {
          var broadcastEl = {};
        }

        if (graph.config.colToPop){
          graph.config.colToPop.forEach(function(el){
            broadcastEl[el.name] = data.jsonData[0][el.name];
          })
        }
        if (graph.config.master){
          $rootScope.$broadcast('DatTest', broadcastEl);
          return;
        }

        if (graph.config.link){
          link.redirect(graph.config, broadcastEl);
          return;
        }

        if (graph.config.modal){
          var modalInstance = $uibModal.open({
            templateUrl : '{widgetsPath}/gaugeChart/src/view/modal.html',
            controller : 'modalInstanceCtrl',
            controllerAs : 'cm',
            resolve: {
              data: ['modalServiceGC',function(modalServiceGC){
                return modalServiceGC.get(graph.config);
              }],
            }
          });
        }
    }

  }
}
gaugeChartController.$inject = ["$scope", "data", "gaugeChartService", "$rootScope", "$uibModal", "link"];



angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartEditController', gaugeChartEditController);

function gaugeChartEditController($scope, $http, config, gaugeChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  this.addSeuil = function(){
    if (!graph.config.seuil){
      graph.config.seuil = [];
    }
    graph.config.seuil.push({});
  }

  this.removeSeuil = function($index){
    graph.config.seuil.splice($index, 1);
  }

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
gaugeChartEditController.$inject = ["$scope", "$http", "config", "gaugeChartService"];



angular.module('adf.widget.gaugeChart')
  .service('gaugeChartService', gaugeChartService);

function gaugeChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/graph";
  var label = [];
  var value = null;
  var valDetail = null;
  var maxDetail = null;

  function createData(jsonData, config){

    var getLabel;
    config.key = [];

    for (var key in jsonData[0]){
      config.key.push(key);
    }

    if(config.key.indexOf('max')){
      console.log('key');
      config.max = jsonData[0]['max'];
    }

    if(config.valDetail){
      valDetail = jsonData[0][config.valDetail];
    }

    if (config.maxDetail){
      maxDetail = jsonData[0][config.maxDetail];
    }

    if(!config.label)
      config.label = config.key[0];

    getLabel = $parse(config.label);
    // label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData[0][config.label];
    return {config : config, value: value, valDetail : valDetail, maxDetail : maxDetail, jsonData : jsonData};
  }

  function fetch(config){
    var url = config.url.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createData(data, config);
      });
  }

  function get(config){
    var result = null;
    if (config.mode == 'exp'){
      result = post(config, expertUrl);
    }
    else if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'easy'){
      if (config.datasource.selected)
        config.url = config.datasource.selected.url;
      result = fetch(config);
    }
    return result
  }

  function post(config, url){
    return $http.post(url, config)
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
gaugeChartService.$inject = ["$q", "$http", "$parse"];
})(window);