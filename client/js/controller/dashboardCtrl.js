angular.module('dashboardInfra.controller')

.controller('dashboardCtrl', function($timeout, $location, $rootScope, $scope, $routeParams, storeService, data, env){
  var dashboard = this;
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

  $scope.$on('copyDash', function(event, category){
    storeService.copy(dashboard.name, category, dashboard.model)
      .then(function(){
        $rootScope.$broadcast('navChanged');
      });
  })
});
