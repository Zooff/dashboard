
'use strict';

angular.module('adf.widget.gaugeChart')
  .controller('gaugeChartController', gaugeChartController);

function gaugeChartController($scope, data, gaugeChartService, $rootScope, $uibModal, link){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.config.label;
    this.value = data.value;
    this.valDetail = data.valDetail;
    this.maxDetail = data.maxDetail;
    this.desc = data.desc;

    if(!graph.config.colorFg){
      graph.config.colorFg = "#009688"
    }

    if(!graph.config.colorBg){
      graph.config.colorBg = "rgba(0,0,0,0.1)";
    }


    if (graph.config.seuil){
      graph.seuil = {};
      graph.config.seuil.forEach(function(el){
        graph.seuil[el.val] = {color : el.color};
      })
    }

    if (graph.valDetail && graph.maxDetail){
      graph.label = graph.valDetail + " / " + graph.maxDetail;
    }
    console.log(graph.label)

    if (data.config.listener){
      $scope.$on('DatTest', function(events, args){
        graph.config.expertReplace = args;
        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        gaugeChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.valDetail = data.valDetail;
          graph.maxDetail = data.maxDetail;
        });
      });
    }

    graph.open = function(){
      if (!graph.config.master && !graph.config.modal && !graph.config.link){
        return;
      }

        if (graph.config.expertReplace){
          var broadcastEl = graph.config.expertReplace;
        }
        else {
          var broadcastEl = {};
        }

        if (graph.config.colToPop){
          graph.config.colToPop.forEach(function(el){
            broadcastEl[el.name] = data.jsonData[0][el.name];
          })
        }
        if (graph.config.master){
          $rootScope.$broadcast('DatTest', broadcastEl);
          return;
        }

        if (graph.config.link){
          link.redirect(graph.config, broadcastEl);
          return;
        }

        if (graph.config.modal){
          var modalInstance = $uibModal.open({
            templateUrl : '{widgetsPath}/gaugeChart/src/view/modal.html',
            controller : 'modalInstanceCtrl',
            controllerAs : 'cm',
            resolve: {
              data: ['modalServiceGC',function(modalServiceGC){
                return modalServiceGC.get(graph.config);
              }],
            }
          });
        }
    }

  }
}
