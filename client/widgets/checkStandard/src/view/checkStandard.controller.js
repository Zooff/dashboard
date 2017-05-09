
'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardController', checkStandardController);

function checkStandardController($uibModal, data){
  if (data){
    var cs = this;

    if (data.config.tooltip){
      this.small = data.config.tooltip.substr(0, 10);
      if (data.config.tooltip.length > 10)
        this.small += '...';
    }
    this.data = data;
    // Open the modal which list the Array
    this.open = function(){
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkStandard/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        resolve: {
          data: ['modalServiceCS', function(modalService){
            return modalService.createDataModel(cs.data.config, cs.data.data);
          }]
        }
      });
    }
  }

}
