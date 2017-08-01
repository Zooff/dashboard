(function(window, undefined) {'use strict';


angular.module('adf.widget.gaugeStandard', ['adf.provider'])
  .config(gaugeStandardWidget);

function gaugeStandardWidget(dashboardProvider){
  dashboardProvider
    .widget('gaugeStandard', {
      title: 'Compteur (Standard)',
      description: 'Widget permettant l\'affichage d\'un compteur',
      templateUrl: '{widgetsPath}/gaugeStandard/src/view/view.html',
      controller: 'gaugeStandardController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["gaugeStandardService", "config", function(gaugeStandardService, config){
          return gaugeStandardService.get(config);
        }]
      },
      edit: {
        controller: 'gaugeStandardEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/gaugeStandard/src/edit/edit.html'
      }
    });
}
gaugeStandardWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.gaugeStandard").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/gaugeStandard/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div><label>Description</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><hr><input type=radio ng-model=config.mode value=std id=easy> <label for=easy>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in graph.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=graph.getColumns(config.databaseStandard)></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>Critère de Selection du Maximum</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>Critère de Selection</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Configuration du Graph</label></div><input ng-if=\"config.mode == \'easy\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\'\" for=listener>Slave</label><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=arch>Arch</option><option value=semi>Semi</option><option value=full>Full</option></select></div><div><label>Label (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><label for=append>Unité</label> <input type=text class=form-control id=append ng-model=config.append placeholder=\"GB, Mo, etc...\"> <label for=min>Valeur Minimum</label> <input type=text class=form-control id=min ng-model=config.min placeholder=0></div></form>");
$templateCache.put("{widgetsPath}/gaugeStandard/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/gaugeStandard/src/view/view.html","<div><div ng-hide=graph.data.servers class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.data.servers><div class=text-center><ng-gauge ng-if=graph.data.servers type={{graph.config.type}} size=200 thick=5 value=graph.data.servers.length cap=round label={{graph.config.label}} append={{graph.config.append}} min=graph.config.min max=graph.data.max></ng-gauge></div><div class=text-center><p>{{graph.config.desc}}</p></div></div></div>");}]);


angular.module('adf.widget.gaugeStandard')
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

angular.module('adf.widget.gaugeStandard')
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




angular.module('adf.widget.gaugeStandard')
  .controller('gaugeStandardController', gaugeStandardController);

function gaugeStandardController($scope, data, gaugeStandardService, $uibModal){
  console.log(data)
  if (data){
    var graph = this;
    this.config = data.config;
    graph.data = data.data;
    this.label = data.label;
    this.desc = data.desc;

    console.log(graph.data)

    if (data.config.listener){
      $scope.$on('DatTest', function(events, args){
        graph.config.urlReplace = args;
        graph.load = true;
        // Reload the widget
        gaugeStandardService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
        });
      });
    }

  }
}
gaugeStandardController.$inject = ["$scope", "data", "gaugeStandardService", "$uibModal"];



angular.module('adf.widget.gaugeStandard')
  .controller('gaugeStandardEditController', gaugeStandardEditController);

function gaugeStandardEditController($scope, $http, config, gaugeStandardService){
  var graph = this;
  this.config = config;
  // Init selecttree object
  config.datasource = {};

  if (!graph.config.principalCol)
    graph.config.principalCol = [];
  if(!graph.config.otherCol)
    graph.config.otherCol = [];
  // Init query Builder
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};

  if(!config.condition2)
    config.condition2 = {'group' : {'operator' : 'AND', 'rules' : []}};

  if(!config.condition3)
    config.condition3 = {'group' : {'operator' : 'AND', 'rules' : []}};

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
      console.log(data);
      getRefColumn(data);
    });
  }


}
gaugeStandardEditController.$inject = ["$scope", "$http", "config", "gaugeStandardService"];



angular.module('adf.widget.gaugeStandard')
  .service('gaugeStandardService', gaugeStandardService);

function gaugeStandardService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/gauge";

  function createData(jsonData, config){
    console.log(jsonData);
    return {config : config, data: jsonData[0]};
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
    if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'exp'){
      result = post(config, expertUrl);
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
gaugeStandardService.$inject = ["$q", "$http", "$parse"];
})(window);