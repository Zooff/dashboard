'use strict';

angular.module('adf.widget.gaugeChart', ['adf.provider'])
  .config(gaugeChartWidget);

function gaugeChartWidget(dashboardProvider){
  dashboardProvider
    .widget('gaugeChart', {
      title: 'Compteur',
      description: 'Widget permettant l\'affichage d\'un compteur',
      templateUrl: '{widgetsPath}/gaugeChart/src/view/view.html',
      controller: 'gaugeChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: function(gaugeChartService, config){
          return gaugeChartService.get(config);
        }
      },
      edit: {
        controller: 'gaugeChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/gaugeChart/src/edit/edit.html'
      }
    });
}
