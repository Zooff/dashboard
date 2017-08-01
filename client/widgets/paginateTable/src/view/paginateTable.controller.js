'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController($scope, $rootScope, data, $uibModal, paginateTableService){

  var pt = this;

  pt.load = false;

  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
    this.orderField = 0;
    this.reverseSort = false;
    this.first = true;

    // Change the orderBy header
    this.sortIndex = function(index){
      pt.first = false;
      pt.reverseSort = !pt.reverseSort;
      return pt.orderField = index;
    }

    this.sorter = function(item){
      if (pt.first)
        return
      return item[pt.orderField].value;
    }

    pt.getData = function(){
      // We need to remove nested objects from data.rows to use ngCsv
      var array = angular.copy(pt.data.rows)
      for (var row = 0; row < array.length; row++){
        for (var r = 0; r < array[row].length; r++){
          array[row][r] = array[row][r].value
        }
      }

      return array;
    }

    pt.getHeader = function(){
      return pt.data.headers;
    }

    if (pt.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        pt.data.config.expertReplace = args;
        pt.data.config.urlReplace = args[pt.data.config.slaveValue];
        pt.load = true;
        paginateTableService.get(pt.data.config).then(function(response){
          pt.load = false;
          pt.data = response;
          pt.data.maxSize = 5;
          pt.data.currentPage = 1;
        })
      })
    }

    pt.verifSeuil = function(val, seuilOp, seuilVal){
      if (!isNaN(val)){
        if (seuilOp == 'Sup'){
          return val > seuilVal;
        }
        if (seuilOp == 'Inf'){
          return val < seuilVal;
        }
      }
    }

    // Click on the tab
    pt.open = function(row){

      // If not master or not had a modal, do nothing
      if(!pt.data.config.master && !pt.data.config.modalDatasource.selected && !pt.data.config.modalUrl )
        return;

      if (pt.data.config.expertReplace){
        var broadcastEl = pt.data.config.expertReplace;
      }
      else {
        var broadcastEl = {};
      }
      if (pt.data.config.colToPop){
        pt.data.config.colToPop.forEach(function(col){
          broadcastEl[col.name] = row.find(function(el){
            return el.title == col.name;
          }).value;
        })
      }

      // Master Widget : Broadcast the selected column value
      if(pt.data.config.master){
        $rootScope.$broadcast('DatTest',broadcastEl);
        return;
      }

      // Open the modal
      if(pt.data.config.modalDatasource.selected)
        pt.data.config.modalUrl = pt.data.config.modalDatasource.selected.url;

      if (pt.data.config.modalUrl){
        pt.data.config.urlReplace = broadcastEl[pt.data.config.colToPop[0].name];
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
