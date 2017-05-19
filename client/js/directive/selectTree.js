'use strict';

angular.module('dashboardInfra')

.directive('selecttree', function(autocomplete){
  return {
    restrict: 'E',
    scope : {
        model: '='
    },
    link : function(scope, el){
      scope.breadcrumbs = [{url : ''}];
      autocomplete.autocomplete("")
        .then(function(data) { scope.addresses = data});

      function getIndex(array, name, value) {
        for (var i =0; i < array.length; i++){
          if (array[i][name] ==  value){
            return i;
          }
        }
        return -1;
      };

      scope.loadNextAddress = function(address, $select){
        $select.search = '';

        scope.breadcrumbs.push(address);
        autocomplete.autocomplete(address.url)
          .then(function (data){ scope.addresses = data});
        scope.$broadcast('uiSelectFocus');
      };

      scope.goBackTo = function(crumb, $select){
        $select.search = '';

        var index = getIndex(scope.breadcrumbs, 'url' ,crumb.url);
        scope.breadcrumbs.splice(index +1, scope.breadcrumbs.length);
        autocomplete.autocomplete(scope.breadcrumbs[scope.breadcrumbs.length -1].url)
          .then(function(data) {scope.addresses = data});
        $select.open =false;
        scope.$broadcast('uiSelectFocus');
      }
    },
    templateUrl : '/js/directive/selectTree.html'
  }
})

.directive('uiSelectFocuser', function($timeout){
  return {
    restrict: 'A',
    require: '^uiSelect',
    link: function(scope, elem, attrs, uiSelect){
      scope.$on('uiSelectFocus', function(){
        $timeout(uiSelect.activate);
      });
    }
  };
})


.service('autocomplete', function($http){
  return {
    autocomplete : function(val){
      return $http.get('/autocomplete', {
        params: {
          val : val + '/'
        }
      })
      .then(function(response){
        return response.data;
      });
    }
  }
})

.run(['$templateCache', function($templateCache){
  $templateCache.put('bootstrap/choices.tpl.html', [
    '<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" ng-show=\"$select.open && $select.items.length > 0\">',
    ' <li ng-show="breadcrumbs.length > 1" class="ui-select-breadcrumbs">',
    '   <span class="ui-select-breadcrumb" ng-repeat="crumb in breadcrumbs" ng-click="goBackTo(crumb, $select)">',
    '     {{crumb.url.substr(crumb.url.lastIndexOf("/") +1)}}',
    '   </span>',
    ' </li>',
    ' <li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\">',
    '   <div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div>',
    '   <div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div>',
    '   <div ng-attr-id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: null, disabled: $select.isDisabled(this)}\" role=\"option\">',
    '     <span class=\"ui-select-choices-row-inner\"></span>',
    '   </div>',
    ' </li>',
    '</ul>'
  ].join(''));
}])
