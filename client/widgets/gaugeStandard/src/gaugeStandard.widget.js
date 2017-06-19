'use strict';

angular.module('adf.widget.gaugeStandard', ['adf.provider'])
  .config(gaugeStandardWidget);

function gaugeStandardWidget(dashboardProvider){
  dashboardProvider
    .widget('gaugeStandard', {
      title: 'Compteur (Standard)',
      description: 'Widget permettant l\'affichage d\'un compteur',
      templateUrl: '{widgetsPath}/gaugeStandard/src/view/view.html',
      controller: 'gaugeStandardController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: function(gaugeStandardService, config){
          return gaugeStandardService.get(config);
        }
      },
      edit: {
        controller: 'gaugeStandardEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/gaugeStandard/src/edit/edit.html'
      }
    });
}
