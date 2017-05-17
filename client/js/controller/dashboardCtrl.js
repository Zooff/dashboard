angular.module('dashboardInfra.controller')

.controller('dashboardCtrl', function($location, $rootScope, $scope, $routeParams, storeService, data, env){
  this.name = $routeParams.id;
  this.model = data;
  this.model.env = env;

  this.delete = function(id){
    storeService.delete(id);
    $location.path('/');
    $rootScope.$broadcast('navChanged');
  };

  $scope.widgetFilter = function(widget, title){
    return !(title === 'checkValue') && !(title === 'beerCounter');
  }

  $scope.$on('adfDashboardChanged', function(event, name, model) {
    storeService.set(name, model);
  });
});
