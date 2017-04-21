(function(window, undefined) {'use strict';


angular.module('adf.widget.checkValue', ['adf.provider'])
  .config(checkValueWidget);

function checkValueWidget(dashboardProvider){
  dashboardProvider
    .widget('checkValue', {
      title: 'checkValue',
      description: 'Graphs with an expert mode to personalize the query',
      templateUrl: '{widgetsPath}/checkValue/src/view/view.html',
      controller: 'checkValueController',
      controllerAs: 'cv',
      reload: true,
      resolve: {
        data: ["checkValueService", "config", function(checkValueService, config){
          return checkValueService.get(config);
        }]
      },
      edit: {
        controller: 'checkValueEditController',
        controllerAs: 'cv',
        templateUrl: '{widgetsPath}/checkValue/src/edit/edit.html'
      }
    });
}
checkValueWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.checkValue").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/checkValue/src/edit/edit.html","<form role=form><div class=form-group><label for=sample>URL</label> <input type=text class=form-control ng-model=config.url placeholder=\"Enter url\"></div><div><input type=checkbox ng-model=config.pourcent> <label>Pourcentage ?</label></div><div><label>Principal Data</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=\"Enter Description of the data\"></div><div class=form-group><label class=sr-only for=sample>Principal Data</label> <input type=text class=form-control ng-model=config.root placeholder=\"Enter name of principal data\"></div></div><div><label>Test</label></div><div class=\"form-inline padding-bottom\"><div class=form-group><label class=sr-only for=op>Operation</label><select class=form-group id=op ng-model=config.op required><option value=eq>==</option><option value=sup>></option><option value=inf><</option><option value=dif>!=</option></select></div><div class=form-group><label class=sr-only for=test>Value</label> <input type=text id=test class=form-control placeholder=\"Test Value\" ng-model=config.test required></div></div></form>");
$templateCache.put("{widgetsPath}/checkValue/src/view/view.html","<div><div ng-hide=cv.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-if=!cv.data.pourcent><div class=text-center><i ng-show=cv.data.ok class=\"fa fa-check fa-4x text-success\" aria-hidden=true></i> <i ng-hide=cv.data.ok class=\"fa fa-times fa-4x text-danger\" aria-hidden=true></i><p>{{cv.data.desc}} : {{cv.data.data}}</p></div></div><div ng-if=cv.data.pourcent><div class=text-center><i ng-show=\"cv.data.ok && cv.data.positif\" class=\"fa fa-carret-up fa-4x text-success\" aria-hidden=true></i> <i ng-hide=\"cv.data.ok && cv.data.positif\" class=\"fa fa-carret-down fa-4x text-danger\" aria-hidden=true></i> <i ng-show=\"cv.data.ok && !cv.data.positif\" class=\"fa fa-carret-up fa-4x text-danger\" aria-hidden=true></i> <i ng-hide=\"cv.data.ok && !cv.data.positif\" class=\"fa fa-carret-down fa-4x text-success\" aria-hidden=true></i><p>{{cv.data.desc}} : {{cv.data.data}}</p></div></div></div>");}]);



angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, data, checkValueService){
  this.data = data;

  this.data.positif = data.data > 0;
  
}
checkValueController.$inject = ["$scope", "data", "checkValueService"];



angular.module('adf.widget.checkValue')
  .controller('checkValueEditController', checkValueEditController);

function checkValueEditController($scope, config, checkValueService){
  this.config = config;

}
checkValueEditController.$inject = ["$scope", "config", "checkValueService"];



angular.module('adf.widget.checkValue')
  .service('checkValueService', checkValueService);

function checkValueService($q, $http, $parse){


  function createData(jsonData, config){
    var data = $parse(config.root)(jsonData);
    var ok = false;

    switch(config.op){
      case "eq":
        ok = (data == config.test);
        break;
      case "dif":
        ok = (data != config.test);
        break;
      case "sup":
        ok = (data > config.test);
        break;
      case "inf":
        ok = (data < config.test);
        break;
      default:
        ok = false;
    }

    return {desc: config.desc, data: data, ok: ok};
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
    if (config.expert){
      result = post(config);
    }
    else if (config.url){
      result = fetch(config);
    }
    return result
  }

  return {
    get: get
  };
}
checkValueService.$inject = ["$q", "$http", "$parse"];
})(window);