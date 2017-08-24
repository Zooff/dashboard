angular.module('dashboardInfra.controller')

.controller('carousel', function(carouselService, $uibModal, $q){

  var ctl = this;
  this.interval = 5000;
  this.nowrap = false;
  carouselService.getAll().then(function(data){
    ctl.slides = data;
  });
  console.log(ctl.slides);


  ctl.add = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/addValueCarouselModal.html',
      controller: 'addCtrl',
      controllerAs : 'ctrl',
    });

    modalInstance.result.then(function(selected){
      var q = carouselService.add(selected);
      $q.all([q, carouselService.getAll()]).then(function(data){
        ctl.slides = data[1];
      });
    })
  }

  ctl.remove = function(index){
    console.log(index)
    var q = carouselService.remove(index)
    $q.all([q, carouselService.getAll()]).then(function(data){
      ctl.slides = data[1];
    });
  }
})


.controller('addCtrl', function($uibModalInstance){
  var ctrl = this;
  ctrl.selected = null;
  ctrl.ok = function(){
    $uibModalInstance.close(ctrl.selected);
  }

  ctrl.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
})
