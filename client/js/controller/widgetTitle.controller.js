angular.module('dashboardInfra.controller')

.controller('widgetTitleCtrl', function($scope){
  var title = this;

  title.def = $scope.$parent.$parent.definition;
  title.config = $scope.$parent.$parent.config;
  if (title.config.titleReplace)
    title.title = title.def.title.replace(/:\w+/, title.config.titleReplace);
  else {
    title.title = title.def.title;
  }
  $scope.$on('DatTest', function(events, args){
    title.title = title.def.title;
    for (key in args){
      var regex = new RegExp(':'+key+'\\b', 'gi');
      if (title.title.match(regex))
        title.title = title.title.replace(regex, title.config.expertReplace[key]);
    }
  });

})
