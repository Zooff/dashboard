
'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, $uibModal, data, checkValueService){
  if (data){
    var cv = this;
    this.data = data;

    console.log(data)

    if (this.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        cv.datTest = args;
      });
    }

    this.configModal = cv.data.config;
    this.data.positif = data.data > 0;
    if (this.data.config.pourcent && this.data.data == 0)
      this.data.zero = true;


    // Open the modal which list the Array
    this.open = function(){
      if (!cv.data.config.modalUrl)
        return;
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkValue/src/view/modal.html',
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
