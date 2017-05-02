'use strict';

angular.module('dashboardInfra', ['adf', 'ngRoute', 'chart.js', 'adf.structures.base', 'dashboardInfra.controller', 'adf.widget.clock',
'adf.widget.table', 'adf.widget.wysiwyg','adf.widget.markdown', 'adf.widget.beerCounter', 'adf.widget.singleValue',
'adf.widget.pieChart', 'adf.widget.lineChart','adf.widget.checkValue', 'adf.widget.paginateTable'])

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
      controllerAs: 'test',
      templateUrl: "templates/accueil.html",
      login: false,
      // resolve: {
      //   auth: function resolveAuth(authResolver){
      //     return authResolver.resolve();
      //   }
      // }
    })
    .when('/boards/:id', {
      controller: 'dashboardCtrl',
      controllerAs: 'dashboard',
      templateUrl: 'templates/dashboard.html',
      login : true,
      resolve: {
        data: function($route, storeService){
          return storeService.get($route.current.params.id);
        },
        env : function($route, utils){
          return utils.getEnv($route.current.params.id);
        }
      }
    })
    .otherwise({
      redirectTo: "/accueil"
    });


})

.config(function($httpProvider){
  $httpProvider.interceptors.push([
    '$injector',
    function($injector){
      return $injector.get('AuthInterceptor');
    }
  ]);
})

.run(function($rootScope, $location, Auth){
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    console.log(Auth.isAuthenticated())
    if(next.login && !Auth.isAuthenticated()){
      $location.path('/accueil');
    }
  });
})
