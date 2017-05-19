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

angular.module("adf.widget.lineChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/lineChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div class=form-group><label for=sample>Datasource</label><div ng-show=config.url class=\"alert alert-info text-center\">{{config.url}}</div><selecttree model=config.dataSource></selecttree></div><input type=checkbox ng-model=config.listener> <label>Slave</label><div><label>Graph</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><div><label>Label</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Value</label></div><div class=form-group><label class=sr-only for=value>Value</label> <input type=text id=value class=form-control ng-model=config.value placeholder=\"Première Donnée\" uib-typeahead=\"key for key in config.key\" typeahead-min-length=0></div><div class=form-group><label class=sr-only for=value2>Value2</label> <input type=text id=value2 class=form-control ng-model=config.value2 placeholder=\"Seconde Donnée\" uib-typeahead=\"key for key in config.key\" typeahead-min-length=0></div><div><label>Type du graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=line>Line</option><option value=bar>Bar</option><option value=horizontalBar>Horizontal Bar</option><option value=radar>Radar</option></select></div><div><input type=checkbox ng-model=expert> Expert Mode</div><div ng-show=expert><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database></div><div class=form-group><label class=sr-only for=query>Query</label> <textarea id=query class=form-control rows=5 placeholder=Query ng-model=config.expert></textarea></div></div></form>");
$templateCache.put("{widgetsPath}/lineChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label><div><canvas id=graph class=chart-base chart-type=graph.type chart-data=graph.value chart-labels=graph.label chart-series=graph.series chart-options=graph.options></canvas></div><div><p class=text-center>{{graph.desc}}</p></div></div></div>");}]);



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

}
lineChartController.$inject = ["$rootScope", "$scope", "data", "lineChartService"];



angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, $http, config, lineChartService){
  this.config = config;
  config.dataSource = {};

  $scope.getAutocompletion = function(val){
    return $http.get('/autocomplete', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    });
  }

}
lineChartEditController.$inject = ["$scope", "$http", "config", "lineChartService"];



angular.module('adf.widget.lineChart')
  .service('lineChartService', lineChartService);

function lineChartService($q, $http, $parse){
  // EndPoint Url for the expert mode
  var expertUrl = '/expert/query';
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
      config.value = config.key[1];

    getValue = $parse(config.key[1]);

    if (!config.value2)
      config.value2 = config.key[2];

    getValue2 = $parse(config.value2);

    label = jsonData.map(function(u){return getLabel(u);});
    var val = jsonData.map(function(u){return getValue(u);});
    var val2 = jsonData.map(function(u){return getValue2(u)});
    value.push(val);
    value.push(val2);
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
    if (config.expert){
      result = post(config);
    }
    else if (config.dataSource){
      if(config.dataSource.selected)
        config.url = config.dataSource.selected.url;
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
lineChartService.$inject = ["$q", "$http", "$parse"];
})(window);