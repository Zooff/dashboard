'use strict';

angular.module('dashboardInfra', ['adf', 'ngRoute', 'chart.js', 'adf.structures.base', 'dashboard_infra.controller', 'adf.widget.clock',
'adf.widget.table', 'adf.widget.wysiwyg','adf.widget.markdown', 'adf.widget.beerCounter', 'adf.widget.singleValue'])

.config(function($routeProvider){
  $routeProvider
    .when('/accueil', {
      controller: 'testCtrl',
      templateUrl: "templates/accueil.html"
    })
    .when('/boards/:id', {
      controller: 'dashboardCtrl',
      controllerAs: 'dashboard',
      templateUrl: 'templates/dashboard.html',
      resolve: {
        data: function($route, storeService){
          return storeService.get($route.current.params.id);
        }
      }
    })
    .otherwise({
      redirectTo: "/accueil"
    });
})
