
'use strict';

angular.module('adf.widget.checkValue')
  .controller('checkValueController', checkValueController);

function checkValueController($scope, $uibModal, data, checkValueService){
  if (data){
    var cv = this;
    this.data = data;
    this.data.positif = data.data > 0;
    if (this.data.pourcent && this.data.data == 0)
      this.data.zero = true;


    // Open the modal which list the Array
    this.open = function(){
      console.log('ok');
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/checkValue/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        resolve: {
          data: function(){
            return cv.data.model;
          }
        }
      });
    }
  }

}
