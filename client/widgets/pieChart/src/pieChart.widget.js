'use strict';

angular.module('adf.widget.pieChart', ['adf.provider'])
  .config(pieChartWidget);

function pieChartWidget(dashboardProvider){
  dashboardProvider
    .widget('pieChart', {
      title: 'Camembert',
      description: 'Widget permettant l\'affichage de Camembert',
      templateUrl: '{widgetsPath}/pieChart/src/view/view.html',
      controller: 'pieChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: function(pieChartService, config){
          return pieChartService.get(config);
        }
      },
      edit: {
        controller: 'pieChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/pieChart/src/edit/edit.html'
      }
    });
}
