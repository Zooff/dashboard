(function(window, undefined) {'use strict';


angular.module('adf.widget.lineChart', ['adf.provider'])
  .config(lineChartWidget);

function lineChartWidget(dashboardProvider){
  dashboardProvider
    .widget('lineChart', {
      title: 'Graphique',
      description: 'Widget permettant l\'affichage d\'histogramme et de courbe',
      templateUrl: '{widgetsPath}/lineChart/src/view/view.html',
      controller: 'lineChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["lineChartService", "config", function(lineChartService, config){
          return lineChartService.get(config);
        }]
      },
      edit: {
        controller: 'lineChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/lineChart/src/edit/edit.html'
      }
    });
}
lineChartWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.lineChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/lineChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in graph.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=graph.getColumns(config.databaseStandard)></div><div class=form-group><label for=sample>Label</label> <input id=sample type=text class=form-control ng-model=config.columnStandard autocomplete=off uib-typeahead=\"col as col.name for col in graph.column\" typeahead-min-length=0></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>SEC</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><input type=checkbox ng-model=config.listener> <label>Slave</label><div><label>Graph</label></div><div><label>Label</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Value</label></div><div class=form-group><label class=sr-only for=value>Value</label> <input type=text id=value class=form-control ng-model=config.value placeholder=\"Première Donnée\" uib-typeahead=\"key for key in config.key\" typeahead-min-length=0></div><div class=form-group><label class=sr-only for=value2>Value2</label> <input type=text id=value2 class=form-control ng-model=config.value2 placeholder=\"Seconde Donnée\" uib-typeahead=\"key for key in config.key\" typeahead-min-length=0></div><div><label>Type du graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=line>Line</option><option value=bar>Bar</option><option value=horizontalBar>Horizontal Bar</option><option value=radar>Radar</option></select></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><input type=checkbox ng-model=config.noPoint><label>No point</label><div><label for=color>Couleur Value 1 :</label> <input type=color ng-model=config.color id=color></div><div ng-if=config.value2><label for=color2>Couleur Value 2 :</label> <input type=color ng-model=config.color2 id=color2></div></div></form>");
$templateCache.put("{widgetsPath}/lineChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label>{{config.urlReplace}}<div><canvas id=graph class=chart-base chart-type=graph.type chart-data=graph.value chart-labels=graph.label chart-series=graph.series chart-options=graph.options chart-colors=graph.color></canvas></div><div><p class=text-center>{{graph.desc}}</p></div><my-export chart=graph.chart></my-export></div></div>");}]);



angular.module('adf.widget.lineChart')
  .controller('lineChartController', lineChartController);

function lineChartController($rootScope, $scope, data, lineChartService){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.value = data.value;
    // Type of graph : line, bar, horizontalBar, radar
    this.type = data.type;
    this.desc = data.desc;
    this.series = data.series;

    $scope.$on('chart-create', function(event, chart){
      graph.chart = chart;
    });

    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        lineChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.series = response.series;
        });
      });
    }
  }
  // Option for the chart --> See the chart.js options
  this.options = {legend : {display : true, position :'bottom'}};

  if (this.config.noPoint){
    this.options.elements = {point : {hitRadius : 15, hoverRadius : 5, radius: 0}};
  }

  if (graph.config.color){
    graph.color = [];
    graph.color.push(graph.config.color);
    if (graph.config.color2){
      graph.color.push(graph.config.color2)
    }
  }



}
lineChartController.$inject = ["$rootScope", "$scope", "data", "lineChartService"];



angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, $http, config, lineChartService){
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
lineChartEditController.$inject = ["$scope", "$http", "config", "lineChartService"];



angular.module('adf.widget.lineChart')
  .service('lineChartService', lineChartService);

function lineChartService($q, $http, $parse){
  // EndPoint Url for the expert mode
  var expertUrl = '/expert/query';
  var standardUrl = '/standard/lineChart';
  var label = [];
  var value = [];


  function createData(jsonData, config){
    label = [];
    value = [];
    config.key = [];
    var getLabel, getValue, getValue2;

    // Get all the key to give user a choice
    for (var k in jsonData[0]){
      config.key.push(k);
    }

    // Try to be smart... This cant be right because Json object are Hashmap...
    if (!config.label)
      config.label = config.key[0];

    getLabel = $parse(config.label);

    if (!config.value)
      config.value = config.value;

    getValue = $parse(config.key[1]);

    label = jsonData.map(function(u){return getLabel(u);});
    var val = jsonData.map(function(u){return getValue(u);});

    value.push(val);
  

    if (config.value2){
      getValue2 = $parse(config.value2);
      var val2 = jsonData.map(function(u){return getValue2(u)});
      value.push(val2);
    }


    return {config: config, label: label, value: value, type: config.type, desc : config.desc, series: [config.value, config.value2]};
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
      if(config.datasource.selected){
        config.url = config.datasource.selected.url;
      }
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
lineChartService.$inject = ["$q", "$http", "$parse"];
})(window);