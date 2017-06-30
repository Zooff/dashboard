'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController($rootScope, $scope, $timeout, data, singleValueService){
  if (data){
    var sv = this;
    this.data = data;

    sv.getSeuilColor = function(){
      if (sv.data.config.seuilOp == 'Sup'){
        return (sv.data.config.seuilVal > sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.data.config.seuilOp == 'Inf'){
        return (sv.data.config.seuilVal < sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
      if (sv.data.config.seuilOp == 'Eg'){
        return (sv.data.config.seuilVal == sv.data.principalData.data) ? 'text-success' : 'text-danger';
      }
    }


    //  When an event occur from the master widget
    if (sv.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        console.log(args);
        sv.data.config.urlReplace = args[sv.data.config.slaveValue];
        sv.data.load = true;
        // Reload the widget
        singleValueService.get(sv.data.config).then(function(response){
          sv.data.load = false;
          sv.data = response; // Bind the result in the model
        });
      });
    }
  }
}
