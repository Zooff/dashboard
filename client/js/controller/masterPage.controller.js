angular.module('dashboardInfra.controller')

.controller('masterPage', function($window, $timeout, $location, $scope, $rootScope, data, env, info, storeService){
  var mp = this;
  var user = JSON.parse($window.sessionStorage["userInfo"]);
  mp.name = '_master';
  this.model = data;
  this.model.env = env;
  mp.broadcastValue = info;

  this.delete = function(id){
    storeService.delete(id);
    $location.path('/');
    $rootScope.$broadcast('navChanged');
  };

  $scope.widgetFilter = function(widget, title){
    return !(title === 'checkValue') && !(title === 'beerCounter');
  }

  $scope.$on('adfDashboardChanged', function(event, name, model) {

    storeService.setMaster(user.cn, model);
  });

  this.broadcast = function(id){
    if (id == null)
      return;
    $rootScope.$broadcast('DatTest', id);
  }

  $timeout(function(){
    mp.broadcast(mp.broadcastValue);
  }, 200);

  console.log('Logged');

})
