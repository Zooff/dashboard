'use strict';

angular.module('adf.widget.lineChart', ['adf.provider'])
  .config(lineChartWidget);

function lineChartWidget(dashboardProvider){
  dashboardProvider
    .widget('lineChart', {
      title: 'Graphique',
      description: 'Widget permettant l\'affichage d\'histogramme et de courbe',
      templateUrl: '{widgetsPath}/lineChart/src/view/view.html',
      controller: 'lineChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: function(lineChartService, config){
          return lineChartService.get(config);
        }
      },
      edit: {
        controller: 'lineChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/lineChart/src/edit/edit.html'
      }
    });
}
