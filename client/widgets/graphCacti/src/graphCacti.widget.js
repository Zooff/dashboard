'use strict';

angular.module('adf.widget.cactiChart', ['adf.provider'])
  .config(cactiChartWidget);

function cactiChartWidget(dashboardProvider){
  dashboardProvider
    .widget('cactiChart', {
      title: 'Graph Cacti',
      description: 'Widget permettant l\'affichage de graph provenant de l\'outil Cactus/Cacti',
      templateUrl: '{widgetsPath}/cactiChart/src/view/view.html',
      controller: 'cactiChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: function(cactiChartService, config){
          return cactiChartService.get(config);
        }
      },
      edit: {
        controller: 'cactiChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/cactiChart/src/edit/edit.html'
      }
    });
}
