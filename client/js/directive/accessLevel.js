'use strict';

angular.module('dashboardInfra')

.directive('accessLevel', ['Auth','Session', function(Auth, Session){
  return {
    restrict: 'A',
    link: function($scope, element, attrs){
      var prevDisp = element.css('display')
          , userRole
          , accessLevel;

      $scope.user = Session.user;
      $scope.$watch('user', function(user){
        if (user.userRole){
          userRole = user.userRole;
        }
        updateCSS();
      }, true);

      attrs.$observe('accessLevel', function(al){
        if(al) accessLevel = al;
        updateCSS();
      });

      function updateCSS(){
        if (userRole && accessLevel){
          if(!Auth.isAuthorized(accessLevel)){
            element.css('display', 'none');
          }
          else{
            element.css('display', prevDisp);
          }
        }
        else {
          element.css('display', 'none');
        }
      }
    }
  }
}])
