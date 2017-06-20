angular.module('dashboardInfra')

.directive('myRightClick', ['$parse' , function($parse){
  return function(scope, element, attrs){
    var fn = $parse(attrs.myRightClick);
    element.bind('contextmenu', function(event){
      scope.$apply(function(){
        event.preventDefault();
        fn(scope,{$event:event});
      });
    });
  };
}]);
