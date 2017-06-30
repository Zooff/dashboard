angular.module('dashboardInfra.controller')

.controller('widgetTitleCtrl', function($scope){
  var title = this;

  title.def = $scope.$parent.$parent.definition;
  title.config = $scope.$parent.$parent.config;
  if (title.config.titleReplace)
    title.title = title.def.title.replace(/:\w*/, title.config.titleReplace);
  else {
    title.title = title.def.title;
  }
  console.log($scope.$parent.$parent.config)

  $scope.$on('DatTest', function(events, args){
    for (key in args){
      var x = title.def.title.match(/:\w*/)
      if (x && key == x[0].substr(1)){
        title.title = title.def.title.replace(/:\w*/, args[key]);
        title.config.titleReplace = args[key];
      }
    }
  });

})
