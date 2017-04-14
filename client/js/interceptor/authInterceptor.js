'use strict';

// Catch all http request and run the event if the user doesn't have access to the page

angular.module('dashboardInfra')
.factory('AuthInterceptor', function($rootScope, $q, Session, AUTH_EVENTS){
  return {
    responseError : function(response){
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
