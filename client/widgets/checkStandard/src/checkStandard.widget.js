'use strict';

angular.module('adf.widget.checkStandard', ['adf.provider'])
  .config(checkStandardWidget);

function checkStandardWidget(dashboardProvider){
  dashboardProvider
    .widget('checkStandard', {
      title: 'checkStandard',
      description: 'Widgets permettant la création de Check',
      templateUrl: '{widgetsPath}/checkStandard/src/view/view.html',
      controller: 'checkStandardController',
      controllerAs: 'cs',
      reload: true,
      resolve: {
        data: function(checkStandardService, config){
          return checkStandardService.get(config);
        }
      },
      edit: {
        controller: 'checkStandardEditController',
        controllerAs: 'cs',
        templateUrl: '{widgetsPath}/checkStandard/src/edit/edit.html'
      }
    });
}
