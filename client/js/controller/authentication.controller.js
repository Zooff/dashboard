angular.module('dashboardInfra.controller')

.controller('authenticationCtrl', function($uibModal, $scope,Session, Auth){
  var auth = this;
  auth.user = null;

  Auth.login(function(user){
    auth.user = user;
  }, function(){
    console.log("Error Auth");
  });

})
