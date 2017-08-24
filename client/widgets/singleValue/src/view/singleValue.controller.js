'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController($rootScope, $scope, $timeout, data, singleValueService, link){
  if (data){
    var sv = this;
    this.data = data;
    this.config = data.config

    sv.getSeuilColor = function(){
      if (sv.config.seuilOp == 'Sup'){
        return (sv.config.seuilVal > sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.config.seuilOp == 'Inf'){
        return (sv.config.seuilVal < sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.config.seuilOp == 'Eg'){
        return (sv.config.seuilVal == sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
    }


    //  When an event occur from the master widget
    if (sv.config.listener){
      $scope.$on('DatTest', function(events, args){
        sv.config.expertReplace = args;
        sv.config.urlReplace = args[sv.config.slaveValue];
        sv.data.load = true;
        // Reload the widget
        singleValueService.get(sv.data.config).then(function(response){
          sv.data.load = false;
          sv.data = response; // Bind the result in the model
        });
      });
    }

    sv.open = function(){
      if (!sv.config.modal && !sv.config.link){
        return;
      }

        if (sv.config.expertReplace){
          var broadcastEl = sv.config.expertReplace;
        }
        else {
          var broadcastEl = {};
        }

        if (sv.config.colToPop){
          sv.config.colToPop.forEach(function(el){
            broadcastEl[el.name] = data.jsondata[el.name];
          })
        }
        if (sv.config.master){
          $rootScope.$broadcast('DatTest', broadcastEl);
          return;
        }
        console.log('BUG')

        if (sv.config.link){
          link.redirect(sv.config, broadcastEl);
          return;
        }

        if (sv.config.modal){
          var modalInstance = $uibModal.open({
            templateUrl : '{widgetsPath}/singleValue/src/view/modal.html',
            controller : 'modalInstanceCtrl',
            controllerAs : 'cm',
            resolve: {
              data: ['modalServiceSV',function(modalServiceSV){
                return modalServiceSV.get(sv.config);
              }],
            }
          });
        }
    }
  }
}
