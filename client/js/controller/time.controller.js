angular.module('dashboard_infra.controller')

.controller('timeController', function($scope, $interval){
  var clock = this;

  function setTime(){
    var d = new moment();

    clock.time = d.format("HH:mm:ss");
  }

  setTime();

  var promise = $interval(setTime, 1000);

  $scope.$on('$destroy', function(){
    $interval.cancel(promise);
  })
})
