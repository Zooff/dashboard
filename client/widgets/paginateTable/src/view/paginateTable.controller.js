'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController(data, $uibModal, $filter, $scope){

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


    pt.open = function(row){
      if (!pt.data.config.modalUrl)
        return;
      pt.data.config.urlReplace = row[pt.data.config.modalField];
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/paginateTable/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        resolve: {
          data: function(modalService){
            return modalService.get(pt.data.config);
          },
        }
      });
    }
  }
}
