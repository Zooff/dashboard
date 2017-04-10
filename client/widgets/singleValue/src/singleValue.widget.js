'use strict';

angular.module('adf.widget.singleValue', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('singleValue', {
      title: 'singleValue',
      description: 'Displays a table of data from a json url',
      templateUrl: '{widgetsPath}/singleValue/src/view/view.html',
      controller: 'singleValueController',
      controllerAs: 'sv',
      reload: true,
      resolve: {
        data: function(singleValueService, config){
          return singleValueService.get(config);
        }
      },
      edit: {
        controller: 'singleValueEditController',
        controllerAs: 'sv',
        templateUrl: '{widgetsPath}/singleValue/src/edit/edit.html'
      }
    });
}
