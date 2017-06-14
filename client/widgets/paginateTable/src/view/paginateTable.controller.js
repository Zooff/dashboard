'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController($rootScope, data, $uibModal){

  var pt = this;

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
      return item[pt.orderField];
    }

    pt.getData = function(){
      return pt.data.rows;
    }

    pt.getHeader = function(){
      return pt.data.headers;
    }


    pt.open = function(row){

      // Master Widget : Broadcast the selected column value
      if(pt.data.config.master){
        $rootScope.$broadcast('DatTest', row[pt.data.config.modalField]);
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
