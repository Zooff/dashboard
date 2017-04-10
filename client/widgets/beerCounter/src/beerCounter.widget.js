'use strict';

angular.module('adf.widget.beerCounter', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('beerCounter', {
      title: 'beerCounter',
      description: 'Simple counter of beer',
      templateUrl: '{widgetsPath}/beerCounter/src/view/view.html',
      controller: 'beerController',
      controllerAs: 'beer',
      reload: true,
      resolve: {
        data: function(beerService){
          return beerService.get();
        }
      },
      edit: {
        controller: 'beerEditController',
        controllerAs: 'beer',
        templateUrl: '{widgetsPath}/beerCounter/src/edit/edit.html'
      }
    });
}
