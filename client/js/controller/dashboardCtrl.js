angular.module('dashboardInfra.controller')

.controller('dashboardCtrl', function($location, $rootScope, $scope, $routeParams, storeService, data){
  this.name = $routeParams.id;
  this.model = data;

  this.env = data.env;

  this.delete = function(id){
    storeService.delete(id);
    $location.path('/');
    $rootScope.$broadcast('navChanged');
  };

  $scope.$on('adfDashboardChanged', function(event, name, model) {
    storeService.set(name, model);
  });
});
