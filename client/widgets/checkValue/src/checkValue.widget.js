'use strict';

angular.module('adf.widget.checkValue', ['adf.provider'])
  .config(checkValueWidget);

function checkValueWidget(dashboardProvider){
  dashboardProvider
    .widget('checkValue', {
      title: 'checkValue',
      description: 'Graphs with an expert mode to personalize the query',
      templateUrl: '{widgetsPath}/checkValue/src/view/view.html',
      controller: 'checkValueController',
      controllerAs: 'cv',
      reload: true,
      resolve: {
        data: function(checkValueService, config){
          return checkValueService.get(config);
        }
      },
      edit: {
        controller: 'checkValueEditController',
        controllerAs: 'cv',
        templateUrl: '{widgetsPath}/checkValue/src/edit/edit.html'
      }
    });
}
