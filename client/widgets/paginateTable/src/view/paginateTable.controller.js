'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController($scope, $rootScope, data, $uibModal){

  var pt = this;

  pt.load = false;

  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
    this.orderField = 0;
    this.reverseSort = false;

    // Change the orderBy header
    this.sortIndex = function(index){
      pt.reverseSort = !pt.reverseSort;
      return pt.orderField = index;
    }

    this.sorter = function(item){
      return item[pt.orderField].value;
    }

    pt.getData = function(){
      return pt.data.rows;
    }

    pt.getHeader = function(){
      return pt.data.headers;
    }

    if (pt.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        pt.data.config.urlReplace = args;
        pt.load = true;
        paginateTableService.get(pt.data.config).then(function(response){
          pt.load = false;
          pt.data = response.data;
        })
      })
    }


    pt.open = function(row){

      // Master Widget : Broadcast the selected column value
      if(pt.data.config.master){

        // Get the key String value from header
        var key = pt.data.headers[pt.orderField]
        // Need the response data from the database, cause the data we show are not all the data
        // Sort the data because we need to have them sort as the data view
        pt.data.bigdata.sort(function(a, b){
          if (!pt.reverseSort){
            return (a[key] > b[key]);
          }
          else {
              return (a[key] < b[key]);
          }
        });
        $rootScope.$broadcast('DatTest',pt.data.bigdata[row][pt.data.config.modalField]);
        return;
      }

      // Open the modal
      if(pt.data.config.modalDatasource)
        pt.data.config.modalUrl = pt.data.config.modalDatasource.selected.url;

      if (pt.data.config.modalUrl){
        pt.data.config.urlReplace = row[pt.data.config.modalField];
        var modalInstance = $uibModal.open({
          templateUrl : '{widgetsPath}/paginateTable/src/view/modal.html',
          controller : 'modalInstanceCtrl',
          controllerAs : 'cm',
          resolve: {
            data: ['modalService',function(modalService){
              return modalService.get(pt.data.config);
            }],
          }
        });
      }
    }
  }
}
