'use strict';

angular.module('adf.widget.paginateTable', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('paginateTable', {
      title: 'Tableau Paginé',
      description: 'Widget permettant d\'afficher un tableau paginé',
      templateUrl: '{widgetsPath}/paginateTable/src/view/view.html',
      controller: 'paginateTableController',
      controllerAs: 'pt',
      reload: true,
      resolve: {
        data: function(paginateTableService, config){
          return paginateTableService.get(config);
        }
      },
      edit: {
        controller: 'paginateTableEditController',
        controllerAs: 'pt',
        templateUrl: '{widgetsPath}/paginateTable/src/edit/edit.html'
      }
    });
}
