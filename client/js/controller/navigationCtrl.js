angular.module('dashboardInfra.controller')

.controller('navigationCtrl', function($scope, $q, $location, storeService, Session){
  var nav = this;
  nav.navCollapsed = true;

  nav.load = function(){
    if (Session.user){
      nav.user = Session.user.cn;
      nav.path = '_' + nav.user;
    }
  }

  this.toggleNav = function(){
    nav.navCollapsed = ! nav.navCollapsed;
  };

  this.navClass = function(page) {
    var currentRoute = $location.path().substring(1);
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };

  this.create = function(str){
    var id = '_'+ str + '_' + new Date().getTime();
    var q = storeService.set(id, {
      "title": "New Sample",
      "titleTemplateUrl" : "templates/custom-dashboard-title.html",
      "addTemplateUrl" : "templates/custom-add-widget.html",
      "structure": "4-8",
      "rows": [{
        "columns": [{
          "styleClass": "col-md-4",
          "widgets": []
        },{
          "styleClass": "col-md-8",
          "widgets": []
        }]
      }]
    });

    $q.all([q, storeService.getAll()]).then(function(values){
      nav.items = values[1];
    });
  };

  storeService.getAll().then(function(data){
    nav.items = data;
  });

  $scope.$on('navChanged', function(){
    storeService.getAll().then(function(data){
      nav.items = data;
    });
  });
})
