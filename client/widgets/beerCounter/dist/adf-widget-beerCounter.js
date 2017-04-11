(function(window, undefined) {'use strict';


angular.module('adf.widget.beerCounter', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('beerCounter', {
      title: 'beerCounter',
      description: 'Simple counter of beer',
      templateUrl: '{widgetsPath}/beerCounter/src/view/view.html',
      controller: 'beerController',
      controllerAs: 'beer',
      reload: true,
      resolve: {
        data: ["beerService", function(beerService){
          return beerService.get();
        }]
      },
      edit: {
        controller: 'beerEditController',
        controllerAs: 'beer',
        templateUrl: '{widgetsPath}/beerCounter/src/edit/edit.html'
      }
    });
}
TableWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.beerCounter").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/beerCounter/src/edit/edit.html","<form role=form><div><label>Add a Beer</label></div><div class=\"form-inline padding-bottom\"><input type=text id=name class=form-control placeholder=Name ng-model=user.name> <button type=button class=\"btn btn-primary\" ng-click=addUser(user.name)><i class=\"fa fa-plus\"></i> Add</button></div></form>");
$templateCache.put("{widgetsPath}/beerCounter/src/view/view.html","<div><div ng-hide=beer.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=beer.data class=row><div class=col-md-6><ul><li ng-repeat=\"b in beer.data\">{{b.user}} {{b.beer}} <i class=\"fa fa-beer fa-lg\" aria-hidden=true></i> <i class=\"fa fa-plus-circle\" aria-hidden=true ng-click=addBeer($index)></i> <i class=\"fa fa-minus-circle\" aria-hidden=true ng-click=removeBeer($index)></i></li></ul></div><div class=col-md-6><canvas id=beerDoughnut class=\"chart chart-doughnut\" chart-data=beer.value chart-labels=beer.user></canvas></div></div></div>");}]);



angular.module('adf.widget.beerCounter')
  .controller('beerController', beerController);

function beerController($scope, data, beerService){
  this.data = data.data;

  // Pie Chart Data
  this.user = data.user;
  this.value = data.value;


  $scope.addBeer = function(beerCount){
    beerService.addBeer(beerCount);
  }

  $scope.removeBeer = function(beerCount){
    beerService.removeBeer(beerCount);
  }
}
beerController.$inject = ["$scope", "data", "beerService"];



angular.module('adf.widget.beerCounter')
  .controller('beerEditController', beerEditController);

function beerEditController($scope, config, beerService){
  this.config = config;

  $scope.addUser = function(name){
    beerService.addUser(name);
  }
}
beerEditController.$inject = ["$scope", "config", "beerService"];



angular.module('adf.widget.beerCounter')
  .service('beerService', beerService);

function beerService($q, $http, $parse){
  var url = "api/beers";
  var data = [];
  var user = [];
  var value = [];

  function removeBeer(id){
      if (data[id].beer >= 1){
        data[id].beer--;
      }
      value[id] = data[id].beer;
      post(data);
  }

  function addBeer(id){
    data[id].beer++;
    value[id] = data[id].beer;
    post(data);
  }

  function addUser(name){
    data.push({user: name, beer: 1});
    user.push(name);
    value.push(1);
    post(data);
  }

  function createData(jsonData){
    data = jsonData;
    user = jsonData.map(function(u){return u.user;});
    value = jsonData.map(function(u){return u.beer;});
    return {data: data, user: user, value: value};
  }

  function fetch(url){
    return $http.get(url)
      .then(function(response){
        if (response.data){
          return createData(response.data);
        }
        return data;
      }, function(){
        console.log('Error URL');
        return data = [];
      });
  }

  function get(){
    var result = null;
    if (url){
      result = fetch(url);
    }
    return result
  }

  function post(data){
    return $http.post(url, data);
  }

  return {
    get: get,
    addUser : addUser,
    addBeer : addBeer,
    removeBeer : removeBeer,
    user : user,
    value : value
  };
}
beerService.$inject = ["$q", "$http", "$parse"];
})(window);