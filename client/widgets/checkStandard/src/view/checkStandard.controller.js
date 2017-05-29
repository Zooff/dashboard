
'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardController', checkStandardController);

function checkStandardController($uibModal, data){
  if (data){
    var cs = this;

    if (data.config.tooltip){
      this.small = data.config.tooltip.substr(0, 15);
      if (data.config.tooltip.length > 15)
        this.small += '...';
    }
    this.data = data;

    if (this.data.config.seuil){
      if (data.config.seuil.op === '>'){
        this.data.positif = (this.data.data.length > this.data.config.seuil.value);
        console.log(this.data.positif)
      }

      if (data.config.seuil.op === '<'){
        this.data.positif = (this.data.data.length < this.data.config.seuil.value);
      }
    }

    // Open the modal which list the Array
    this.open = function(){
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkStandard/src/view/modal.html',
        controller : 'modalInstanceCtrlCS',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServiceCS', function(modalService){
            return modalService.createDataModel(cs.data.config, cs.data.data);
          }]
        }
      });
    }
  }

}
