'use strict';

angular.module('adf.widget.singleValue')
  .controller('singleValueController', singleValueController);

function singleValueController($rootScope, $scope, $timeout, data, singleValueService){
  if (data){
    var sv = this;
    this.data = data;

    //  When an event occur from the master widget
    if (sv.data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        sv.data.config.urlReplace = args;
        singleValueService.get(sv.data.config).then(function(response){
          sv.data = response;
        });
      });
    }
  }
}
