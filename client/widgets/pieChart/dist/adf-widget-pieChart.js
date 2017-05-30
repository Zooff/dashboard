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

angular.module("adf.widget.pieChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/pieChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div class=form-group><label for=sample>Datasource</label><div ng-show=config.url class=\"alert alert-info text-center\">{{config.url}}</div><selecttree model=config.datasource></selecttree></div><div><label>Graph</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><input id=listener type=checkbox ng-model=config.listener> <label for=listener>Slave</label><div><label>Label</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Value</label></div><div class=form-group><label class=sr-only for=value>Value</label> <input type=text id=value class=form-control ng-model=config.value placeholder=Données uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=pie>Pie</option><option value=polarArea>PolarArea</option><option value=doughnut>Doughnut</option></select></div><div><input id=cbe type=checkbox ng-model=expert> <label for=cbe>Expert Mode</label></div><div ng-show=expert><div class=form-group><label class=sr-only for=database>Database</label> <input type=text id=database class=form-control placeholder=Database ng-model=config.database uib-typeahead=\"database for database in graph.getDatabase($viewValue)\" typeahead-min-length=0></div><div class=form-group><label class=sr-only for=query>Query</label> <textarea rows=3 id=query class=form-control placeholder=Query ng-model=config.expert></textarea></div></div></form>");
$templateCache.put("{widgetsPath}/pieChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label>{{config.urlReplace}}<div><canvas id=graph class=chart-base chart-type=graph.type chart-data=graph.value chart-labels=graph.label chart-options=graph.options></canvas></div><div><p class=text-center>{{graph.desc}}</p></div></div></div>");}]);



angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope){
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
    this.options = {elements: {arc: {borderWidth : 1, borderColor : '#222222'}},legend : {display : true, position :'left'}, cutoutPercentage : cut};

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
  }


}
pieChartController.$inject = ["$scope", "data", "pieChartService", "$rootScope"];



angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, $http, config, pieChartService){
  this.config = config;
  config.datasource = {};

  this.getDatabase = function(){
    return $http.get('/expert')
      .then(function(response){
        return response.data;
      });
  }
}
pieChartEditController.$inject = ["$scope", "$http", "config", "pieChartService"];



angular.module('adf.widget.pieChart')
  .service('pieChartService', pieChartService);

function pieChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
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
    if (config.expert){
      result = post(config);
    }
    else if (config.datasource){
      if (config.datasource.selected)
        config.url = config.datasource.selected.url;
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
pieChartService.$inject = ["$q", "$http", "$parse"];
})(window);