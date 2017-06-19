(function(window, undefined) {'use strict';


angular.module('adf.widget.gaugeChart', ['adf.provider'])
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

angular.module("adf.widget.gaugeChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/gaugeChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div><label>Description</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Configuration du Graph</label></div><input ng-if=\"config.mode == \'easy\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\'\" for=listener>Slave</label><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=arch>Arch</option><option value=semi>Semi</option><option value=full>Full</option></select></div><div><label>Label (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><label for=append>Unité</label> <input type=text class=form-control id=append ng-model=config.append placeholder=\"GB, Mo, etc...\"> <label for=min>Valeur Minimum</label> <input type=text class=form-control id=min ng-model=config.min placeholder=0> <label for=max>Valeur Maximum</label> <input type=text class=form-control id=max ng-model=config.max placeholder=100></div></form>");
$templateCache.put("{widgetsPath}/gaugeChart/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/gaugeChart/src/view/view.html","<div><div ng-hide=graph.value class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.value>{{config.urlReplace}}<div class=text-center><ng-gauge type={{graph.config.type}} size=200 thick=5 value=graph.value cap=round label={{graph.config.label}} append={{graph.config.append}} min=graph.config.min max=graph.config.max></ng-gauge></div><div class=text-center><p>{{graph.config.desc}}</p></div></div></div>");}]);


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
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.pieChart')
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

function gaugeChartController($scope, data, gaugeChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    this.desc = data.desc;

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        gaugeChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

  }
}
gaugeChartController.$inject = ["$scope", "data", "gaugeChartService", "$rootScope", "$uibModal"];



angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartEditController', gaugeChartEditController);

function gaugeChartEditController($scope, $http, config, gaugeChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  
}
gaugeChartEditController.$inject = ["$scope", "$http", "config", "gaugeChartService"];



angular.module('adf.widget.gaugeChart')
  .service('gaugeChartService', gaugeChartService);

function gaugeChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/graph";
  var label = [];
  var value = null;

  function createData(jsonData, config){

    var getLabel;
    config.key = [];

    for (var key in jsonData[0]){
      config.key.push(key);
    }

    if(!config.label)
      config.label = config.key[0];

    getLabel = $parse(config.label);
    // label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData[0][config.label];
    return {config : config, value: value};
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