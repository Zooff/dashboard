angular.module('dashboardInfra.service')

.service('Session', function(){

  this.create = function(user){
    this.user = user;
    this.userRole = user.userRole;
  }

  this.delete = function(){
    this.user = null;
    this.userRole = null;
  }

  return this;
})
