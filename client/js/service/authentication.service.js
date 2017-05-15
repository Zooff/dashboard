angular.module('dashboardInfra.service')

.factory('Auth', ['$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', function($http, $rootScope, $window, Session, AUTH_EVENTS){

  var authService = {};
  var apiEndPoint = "/authentication";

  authService.login = function(success, error){
    $http.get(apiEndPoint)
      .then(function(response){
        if(response.data.user){
          $window.sessionStorage["userInfo"] = response.data.user;

          Session.create(response.data.user);

          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          success(response.data.user);
        }
        else {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          error();
        }
      })
  };

  authService.isAuthenticated = function(){
    return !!Session.user;
  };

  authService.isAuthorized = function(accessLevel){
    return Session.userRole == accessLevel || Session.userRole == 'admin';
  }

  authService.logout = function(){
    Session.destroy;
    $window.sessionStorage.removeItem("userInfo");
    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
  }

  return authService;

}])


.factory('authResolver', function($q, $rootScope, $location){
  return {
    resolve : function () {
      var deffered = $q.defer();
      var unwatch = $rootScope.$watch('user', function(user){
        if (angular.isDefined(user)){
          if (user){
            deffered.resolve(user);
            $location.path('/accueil')
          } else {
            deffered.reject();
          }
          unwatch();
        }
      });
      return deffered.promise;
    }
  }
})
