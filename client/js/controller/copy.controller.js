angular.module('dashboardInfra.controller')

.controller('copyCtrl', function($uibModal, $rootScope){
  var cp = this;

  cp.category = [{key : 'wds', value : "Windows"}, {key : 'unix', value : "Unix"}, {key : 'tsv', value : "Transverse"}];

  cp.copyDialog = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/copyModal.html',
      controller: 'modalCtrl',
      controllerAs : 'ctrl',
      resolve: {
        category: function(){
          return cp.category;
        }
      }
    });

    modalInstance.result.then(function(selected){
      $rootScope.$broadcast('copyDash', selected);
    })
  };

  cp.formatLabel = function(model){
    console.log(model);
    return model.value
  }


})


.controller('modalCtrl', function($uibModalInstance, category){
  var ctrl = this;
  ctrl.selected = null;
  ctrl.category = category;

  ctrl.ok = function(){
    $uibModalInstance.close(ctrl.selected.key);
  }

  ctrl.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
});
