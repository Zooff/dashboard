(function(window, undefined) {'use strict';


angular.module('adf.widget.cactiChart', ['adf.provider'])
  .config(cactiChartWidget);

function cactiChartWidget(dashboardProvider){
  dashboardProvider
    .widget('cactiChart', {
      title: 'Graph Cacti',
      description: 'Widget permettant l\'affichage de graph provenant de l\'outil Cactus/Cacti',
      templateUrl: '{widgetsPath}/cactiChart/src/view/view.html',
      controller: 'cactiChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["cactiChartService", "config", function(cactiChartService, config){
          return cactiChartService.get(config);
        }]
      },
      edit: {
        controller: 'cactiChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/cactiChart/src/edit/edit.html'
      }
    });
}
cactiChartWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.cactiChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/cactiChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><hr><div><label class=ctm-label>Choix du Serveur</label> <input type=text uib-typeahead=\"serv as serv.description for serv in graph.getHost($viewValue)\" typeahead-min-length=3 ng-model=config.hostId typeahead-on-select=graph.getGraphs(config.hostId.id)></div><div ng-if=graph.graphs.length><label class=ctm-label for=gList>Choix du Graph</label> <input type=text uib-typeahead=\"g as g.title_cache for g in graph.graphs\" typeahead-min-length=0 ng-model=config.graphId></div></form>");
$templateCache.put("{widgetsPath}/cactiChart/src/view/view.html","<div><div ng-hide=graph.url class=\"alert alert-info\" role=alert>Please configure the widget</div><div ng-show=graph.url><div><select ng-options=\"time in graph.listTime\" ng-model=graph.timeUnit></select></div><div><img ng-src={{graph.url}}></div><div><p class=text-center>{{graph.desc}}</p></div></div></div>");}]);



angular.module('adf.widget.cactiChart')
  .controller('cactiChartController', cactiChartController);

function cactiChartController($rootScope, $scope, data, cactiChartService){
  if (data){
    var graph = this;
    this.config = data.config;
    this.url = data.url;

    this.listTime = ['jour', 'semaine', 'mois', 'year'];
    this.timeUnit = 'jour';

    var getTimestamp = function(timeUnit){
      var now = moment().unix();
      var last;
      switch(timeUnit){
        case 'jour':
          last = now - (24 * 60 * 60);
          break;
        case 'semaine':
          last = now - (7 * 24 * 60 * 60);
          break;
        case 'mois' :

          break;
        case 'year':
          break;
      }
    }


    var pointDown;
    var pointUp;

    this.mousedown = function(){

    }

    this.mouseup = function(){

    }



  }

}
cactiChartController.$inject = ["$rootScope", "$scope", "data", "cactiChartService"];



angular.module('adf.widget.cactiChart')
  .controller('cactiChartEditController', cactiChartEditController);

function cactiChartEditController($scope, $http, config, cactiChartService){
  var graph = this;
  this.config = config;
  this.graphs = [];

  this.getGraph = function(hostId){
    return $http.get('/standard/cactiGraphId/' + hostId)
      .then(function(response){
        graph.graphs = response.data;
      });
  }

  this.getHost = function(model){
    return $http.get('/standard/cactiHost', {
      params: {
        model : model
      }
    })
    .then(function(response){
      return response.data;
    })
  }

}
cactiChartEditController.$inject = ["$scope", "$http", "config", "cactiChartService"];



angular.module('adf.widget.cactiChart')
  .service('cactiChartService', cactiChartService);

function cactiChartService($q, $http, $parse){

  function get(config){

    var url = "https://cactux/graph.image.php?action=zoom&local_graph_id=" + config.graphId
    return {config : config, url : url}
  }

  return {
    get: get
  };
}
cactiChartService.$inject = ["$q", "$http", "$parse"];
})(window);