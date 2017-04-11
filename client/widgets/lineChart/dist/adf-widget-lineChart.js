(function(window, undefined) {'use strict';


angular.module('adf.widget.lineChart', ['adf.provider'])
  .config(lineChartWidget);

function lineChartWidget(dashboardProvider){
  dashboardProvider
    .widget('lineChart', {
      title: 'lineChart',
      description: 'Graphs with an expert mode to personalize the query',
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

angular.module("adf.widget.lineChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/lineChart/src/edit/edit.html","<form role=form><div class=form-group><label for=sample>URL</label> <input type=text class=form-control ng-model=config.url placeholder=\"Enter url\"></div><div><label>Chart</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><div><label>Chart Type</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=line>Line</option><option value=bar>Bar</option><option value=horizontalBar>Horizontal Bar</option><option value=radar>Radar</option></select></div><div><input type=checkbox ng-model=expert> Expert Mode</div><div ng-show=expert><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database></div><div class=form-group><label class=sr-only for=query>Query</label> <input type=text id=query class=form-control placeholder=Query ng-model=config.expert></div></div></form>");
$templateCache.put("{widgetsPath}/lineChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label><div><canvas id=graph class=chart-base chart-type=graph.type chart-data=graph.value chart-labels=graph.label chart-options=graph.options></canvas></div><div><p class=text-center>{{graph.desc}}</p></div></div></div>");}]);



angular.module('adf.widget.lineChart')
  .controller('lineChartController', lineChartController);

function lineChartController($scope, data, lineChartService){
  if (data){
    this.label = data.label;
    this.value = data.value;
    // Type of graph : line, bar, horizontalBar, radar
    this.type = data.type;
    this.desc = data.desc;
  }
  // Option for the chart --> See the chart.js options
  this.options = {};

}
lineChartController.$inject = ["$scope", "data", "lineChartService"];



angular.module('adf.widget.lineChart')
  .controller('lineChartEditController', lineChartEditController);

function lineChartEditController($scope, config, lineChartService){
  this.config = config;

}
lineChartEditController.$inject = ["$scope", "config", "lineChartService"];



angular.module('adf.widget.lineChart')
  .service('lineChartService', lineChartService);

function lineChartService($q, $http, $parse){
  var label = [];
  var value = [];


  function createData(jsonData, config){
    label = [];
    value = [];
    label = jsonData.map(function(u){return u.label;});
    var val = jsonData.map(function(u){return u.value;});
    var val2 = jsonData.map(function(u){return u.value2});
    value.push(val);
    value.push(val2);
    return {label: label, value: value, type: config.type, desc : config.desc};
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
    if (config.url){
      result = fetch(config);
    }
    return result
  }

  function post(config, data){
    return $http.post(config.expert, data);
  }


  return {
    get: get
  };
}
lineChartService.$inject = ["$q", "$http", "$parse"];
})(window);