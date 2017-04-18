angular.module('dashboardInfra')

.config(function (ChartJsProvider){
  ChartJsProvider.setOptions("global",{
    colors : [
      '#1CA8DD', '#1BC98E', '#E64759', '#9F86FF', '#E4D836', '#949FBI', '#4D5360'
    ]
  });
})
