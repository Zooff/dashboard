'use strict';

angular.module('adf.widget.cactiChart')
  .service('cactiChartService', cactiChartService);

function cactiChartService($q, $http, $parse){

  function get(config){
    if (!config.graphId){
      return
    }
    var url = "https://cactux/graph_image.php?action=zoom&local_graph_id=" + config.graphId.id
    return {config : config, url : url}
  }

  return {
    get: get
  };
}
