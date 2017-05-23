angular.module('dashboardInfra.controller')

.controller('mainCtrl', function(){
  var main = this;
  main.black = true;
  main.style = false;

  main.changeStyle = function(){
    main.style = !main.style;
  }
})
