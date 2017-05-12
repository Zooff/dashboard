'use strict';

angular.module('dashboardInfra', ['adf', 'ngRoute', 'chart.js', 'adf.structures.base', 'dashboardInfra.controller', 'adf.widget.clock',
'adf.widget.table', 'adf.widget.wysiwyg','adf.widget.markdown', 'adf.widget.beerCounter', 'adf.widget.singleValue',
'adf.widget.pieChart', 'adf.widget.lineChart','adf.widget.checkValue', 'adf.widget.checkStandard', 'adf.widget.paginateTable'])

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

// Disable IE ajax request caching
.config(['$httpProvider', function($httpProvider){
  // Initialize get if not there
  if (!$httpProvider.defaults.headers.get){
    $httpProvider.defaults.headers.get = {};
  }

  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])

// Force authent
.run(function($rootScope, $location, Auth){
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    if(next.login && !Auth.isAuthenticated()){
      $location.path('/accueil');
    }
  });
})
