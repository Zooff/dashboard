angular.module('dashboardInfra.service')

.factory('Auth', ['$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', function($http, $rootScope, $window, Session, AUTH_EVENTS){

  var authService = {};
  var apiEndPoint = ""

  authService.login = function(user, success, error){
    $http.post(apiEndPoint, user)
      .then(function(response){
        if(response.data.user){
          $window.sessionStorage["userInfo"] = JSON.stringify(response.data.user);

          delete response.data.user.password;

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

  authService.logout = function(){
    Session.destroy;
    $window.sessionStorage.removeItem("userInfo");
    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
  }

  return authService;

}])
