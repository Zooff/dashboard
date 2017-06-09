(function(window, undefined) {'use strict';


angular.module('adf.widget.pieChart', ['adf.provider'])
  .config(pieChartWidget);

function pieChartWidget(dashboardProvider){
  dashboardProvider
    .widget('pieChart', {
      title: 'Camembert',
      description: 'Widget permettant l\'affichage de Camembert',
      templateUrl: '{widgetsPath}/pieChart/src/view/view.html',
      controller: 'pieChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["pieChartService", "config", function(pieChartService, config){
          return pieChartService.get(config);
        }]
      },
      edit: {
        controller: 'pieChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/pieChart/src/edit/edit.html'
      }
    });
}
pieChartWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.pieChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/pieChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div><label>Description</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><label for=sample>Datasource</label><div ng-show=config.url class=\"alert alert-info text-center\">{{config.url}}</div><selecttree model=config.datasource></selecttree></div><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in graph.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=graph.getColumns(config.databaseStandard)></div><div class=form-group><label for=sample>Label</label> <input id=sample type=text class=form-control ng-model=config.columnStandard autocomplete=off uib-typeahead=\"col as col.name for col in graph.column\" typeahead-min-length=0></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>SEC</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Configuration du Graph</label></div><input ng-if=\"config.mode == \'easy\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\'\" for=listener>Slave</label><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=pie>Camenbert</option><option value=polarArea>PolarArea</option><option value=doughnut>Doughnut</option></select></div><div><label>Label (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Value (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=value>Value</label> <input type=text id=value class=form-control ng-model=config.value placeholder=Données uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><div><input type=checkbox ng-model=config.legend id=legend> <label for=legend>Legende</label></div><div><label>Position de la Legende</label></div><select ng-model=config.legendPosition><option value=top selected>Haut</option><option value=bottom>Bas</option><option value=left>Gauche</option><option value=right>Droite</option></select></div></form>");
$templateCache.put("{widgetsPath}/pieChart/src/view/modal.html","<div class=modal-header><button type=button class=close ng-click=$dismiss() aria-hidden=true>&times;</button><h3 class=modal-title id=modal-title>Title</h3></div><div class=modal-body id=modal-body><modal-table data=cm.data></modal-table></div>");
$templateCache.put("{widgetsPath}/pieChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label>{{config.urlReplace}}<div><canvas id=graph class=chart-base ng-class=\"{click : graph.config.mode == \'std\'}\" chart-type=graph.type chart-data=graph.value chart-labels=graph.label chart-options=graph.options chart-click=graph.open></canvas></div><div><p class=text-center>{{graph.desc}}</p></div></div></div>");}]);



angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
  // Option for the chart --> See the chart.js options
    var cut;
    (this.type == 'doughnut') ? cut = 75 : cut = 0;
    this.options = {elements: {arc: {borderWidth : 1, borderColor : '#222222'}}, cutoutPercentage : cut};

    if (this.config.legend){
      this.options.legend = {display : true, position : this.config.legendPosition};
    }

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        pieChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

    this.open = function(points, evt){
      if (graph.config.mode != 'std'){
        return;
      }
      console.log(points[0]._model.label);
      // Build the condition to obtain the data
      // To do this, add a rule : column selected = label of the part who has been cliked
      var condi =graph.config.condition;
      condi.group.rules.push({condition: '=', field: graph.config.columnStandard ,data: points[0]._model.label})
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/pieChart/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServicePC', function(modalService){
            return modalService.fetch(graph.config, condi);
          }]
        }
      });
    }
  }
}
pieChartController.$inject = ["$scope", "data", "pieChartService", "$rootScope", "$uibModal"];



angular.module('adf.widget.pieChart')
  .service('modalServicePC', modalService);

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

  function fetch(config, condition){
    console.log(condition)
    var data = {
      database : config.databaseStandard,
      test : condition,
      test2 : config.condition2
    }
    return $http.post('/standard', data)
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



angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, $http, config, pieChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};

  if (!graph.config.principalCol)
    graph.config.principalCol = [];
  if(!graph.config.otherCol)
    graph.config.otherCol = [];
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};
  if(!config.condition2)
    config.condition2 = {'group' : {'operator' : 'AND', 'rules' : []}};

  this.getDatabase = function(){
    return $http.get('/standard')
      .then(function(response){

        return response.data;
      });
  }

  function getRefColumn(arrayCol){
    graph.config.principalCol = [];
    graph.config.otherCol = [];
    arrayCol.forEach(function(el){
      if(el.type == 'principal'){
        graph.config.principalCol.push(el)
      }
      else {
        graph.config.otherCol.push(el);
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
      getRefColumn(data);
      graph.column = data;
    });
  }
}
pieChartEditController.$inject = ["$scope", "$http", "config", "pieChartService"];



angular.module('adf.widget.pieChart')
  .service('pieChartService', pieChartService);

function pieChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/graph";
  var label = [];
  var value = [];


  function createData(jsonData, config){

    var getLabel, getValue;
    config.key = [];

    for (var key in jsonData[0]){
      config.key.push(key);
    }

    if(!config.label)
      config.label = config.key[0];

    if(!config.value)
      config.value = config.key[1];

    getLabel = $parse(config.label);
    getValue = $parse(config.value);
    label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData.map(function(u){return getValue(u);});
    return {config : config, label: label, value: value, type: config.type, desc : config.desc};
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
pieChartService.$inject = ["$q", "$http", "$parse"];
})(window);