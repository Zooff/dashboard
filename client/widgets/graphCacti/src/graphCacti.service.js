'use strict';

angular.module('adf.widget.cactiChart')
  .service('cactiChartService', cactiChartService);

function cactiChartService($q, $http, $parse){

  function get(config){

    var url = "https://cactux/graph.image.php?action=zoom&local_graph_id=" + config.graphId
    return {config : config, url : url}
  }

  return {
    get: get
  };
}
