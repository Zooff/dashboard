
'use strict';

angular.module('adf.widget.checkStandard')
  .controller('checkStandardController', checkStandardController);

function checkStandardController($scope, $uibModal, data, checkStandardService){
  if (data){
    var cv = this;
    this.data = data;

    this.configModal = cv.data.config;
    this.data.positif = data.data > 0;
    if (this.data.config.pourcent && this.data.data == 0)
      this.data.zero = true;


    // Open the modal which list the Array
    this.open = function(){
      if (!cv.data.config.modalUrl)
        return;
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkStandard/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        resolve: {
          data: ['modalService', function(modalService){
            return modalService.get(cv.configModal);
          }]
        }
      });
    }
  }

}
