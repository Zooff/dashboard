'use strict';

angular.module('dashboardInfra', ['adf', 'ngRoute', 'chart.js', 'adf.structures.base', 'dashboard_infra.controller', 'adf.widget.clock',
'adf.widget.table', 'adf.widget.wysiwyg','adf.widget.markdown', 'adf.widget.beerCounter', 'adf.widget.singleValue',
'adf.widget.pieChart', 'adf.widget.lineChart','adf.widget.checkValue'])

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.config(function($routeProvider, dashboardProvider){
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
