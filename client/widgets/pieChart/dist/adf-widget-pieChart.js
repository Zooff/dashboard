(function(window, undefined) {'use strict';


angular.module('adf.widget.pieChart', ['adf.provider'])
  .config(pieChartWidget);

function pieChartWidget(dashboardProvider){
  dashboardProvider
    .widget('pieChart', {
      title: 'Camembert',
      description: 'Widget permettant l\'affichage de Camembert',
      templateUrl: '{widgetsPath}/pieChart/src/view/view.html',
      controller: 'pieChartController',
      controllerAs: 'graph',
      reload: true,
      resolve: {
        data: ["pieChartService", "config", function(pieChartService, config){
          return pieChartService.get(config);
        }]
      },
      edit: {
        controller: 'pieChartEditController',
        controllerAs: 'graph',
        templateUrl: '{widgetsPath}/pieChart/src/edit/edit.html'
      }
    });
}
pieChartWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.pieChart").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/pieChart/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><form role=form><div><label>Description</label></div><div class=form-group><label class=sr-only for=desc>Description</label> <input type=text id=desc class=form-control ng-model=config.desc placeholder=Description></div><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in graph.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=graph.getColumns(config.databaseStandard)></div><div class=form-group><label for=sample>Label</label> <input id=sample type=text class=form-control ng-model=config.columnStandard autocomplete=off uib-typeahead=\"col as col.name for col in graph.column\" typeahead-min-length=0></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>Choix des caractéristique secondaires</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div><showsql type=pie config=config></showsql></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Configuration du Graph</label></div><input ng-if=\"config.mode == \'easy\' || \'expert\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\' || \'expert\'\" for=listener>Slave</label><div ng-if=config.listener><label>Master Column</label> <input type=text ng-model=config.slaveValue></div><div><label>Type de Graph</label></div><div class=form-group><label class=sr-only for=sample>Chart Type</label><select class=form-control ng-model=config.type><option value=pie>Camenbert</option><option value=polarArea>PolarArea</option><option value=doughnut>Doughnut</option></select></div><div><label>Label (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=label>Label</label> <input type=text id=label class=form-control ng-model=config.label placeholder=Label uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label>Value (Configuration Automatique)</label></div><div class=form-group><label class=sr-only for=value>Value</label> <input type=text id=value class=form-control ng-model=config.value placeholder=Données uib-typeahead=\"key for key in config.key\" typeahead-min-length=0 autocomplete=off></div><div><label ng-click=\"isCollapsed = !isCollapsed\">Chart Option <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><div><input type=checkbox ng-model=config.legend id=legend> <label for=legend>Legende</label></div><div><input type=checkbox ng-model=config.pourcent id=pouc> <label for=pouc>Afficher les pourcentages sur le Graph</label></div><div><input type=checkbox ng-model=config.pieValue id=pieValue> <label for=pieValue>Afficher la valeur sur le Graph</label></div><div><input type=checkbox ng-model=config.sliced id=sliced> <label for=sliced>Sliced Graph</label></div><div><input type=checkbox ng-model=config.v3d id=v3d> <label for=v3d>3D</label></div><label>Choix des Couleurs</label><div ng-repeat=\"l in config.colorLabel\" ng-if=\"config.colorLabel && $index % 2 == 0\" class=row><div class=col-md-6><label for=color>{{l}} :</label><color-picker ng-model=config.color[$index] options=\"{required : false, format : \'hexString\'}\"></color-picker></div><div class=col-md-6 ng-if=\"config.colorLabel.length > $index +1\"><label for=color>{{config.colorLabel[$index +1]}} :</label><color-picker ng-model=config.color[$index+1] options=\"{required : false, format : \'hexString\'}\"></color-picker></div></div></div></form>");
$templateCache.put("{widgetsPath}/pieChart/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/pieChart/src/view/view.html","<div><div ng-hide=graph.label class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=graph.label><div><div id={{graph.id}} ng-class=\"{click : graph.config.mode == \'std\'}\"></div></div><div><p class=text-center>{{graph.desc}}</p></div><my-export chart=graph.chart></my-export><button type=button class=\"btn btn-success\" ng-csv=graph.value csv-header=graph.label field-separator=; filename=\"{{$parent.model.title + \'.csv\'}}\"><i class=\"fa fa-file-excel-o\" aria-hidden=true></i></button></div></div>");}]);



angular.module('adf.widget.pieChart')
  .controller('pieChartController', pieChartController);

function pieChartController($scope, data, pieChartService, $rootScope, $uibModal){
  if (data){
    var graph = this;
    this.config = data.config;
    this.label = data.label;
    this.series = data.series;
    this.config.colorLabel = this.label;
    this.value = data.value;
    // Type of graph : Pie, bar, line
    this.type = data.type;
    this.desc = data.desc;
    this.id = Math.random().toString(36).substr(2,10);
    console.log(this.id);
  // Option for the chart --> See the chart.js options

    graph.options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        margin: 0,
        marginBottom: 45,
        height: '100%'
      },
      tooltip: {
        pointFormat: '{point.name}: <i>{point.y}</i> - <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          size: '100%',
          slicedOffset: 5,
          borderWidth: 3,
          allowPointSelect: true,
          depth: 45,
          dataLabels: {
             enabled: false
          }

        },
        series: {
          borderColor: 'transparent',
          borderWidth: 5,
          states: {
            hover: {
              halo: false
            }
          }
        }
      },
      series: [{
        type: 'pie',
        data: graph.series
      }],
      title: {
        text: null
      },
      legend: {
        floating: true,
        verticalAlign: 'bottom',
        align: 'center',
        itemStyle: {
          color: "#337AB7"
        }
      },
      credits: {
        enabled: false
      }

    }

    if (this.type == 'doughnut') {
      this.options.plotOptions.pie.innerSize = '75%';
    }
    if (this.config.legend){
      this.options.plotOptions.pie.showInLegend = {
        enabled: true
      };
    }
    if (this.config.v3d){
      graph.options.chart.options3d = {
        enabled: true,
        alpha: 45,
        beta: 0
      }
    }
    if (graph.config.color){
      graph.color = [];
      for (var k in graph.config.color){
        graph.color[k] = graph.config.color[k];
      }
      graph.options.plotOptions.pie.colors = graph.color;
    }

    if (graph.config.pourcent || graph.config.pieValue){
      graph.options.plotOptions.pie.dataLabels = {
        enabled: true,
        distance: -20,
        formatter: function(){
          var str = ""
          if (this.percentage != 0){
            if (graph.config.pourcent)
              str += this.percentage.toFixed(1) + '%';
            if (graph.config.pieValue)
              str += " "+ this.y
          }
          return str;
        }
      }
    }



    if (data.config.listener){
      $rootScope.$on('DatTest', function(events, args){
        graph.config.expertReplace = args;
        graph.config.urlReplace = args[graph.config.slaveValue];
        graph.load = true;
        // Reload the widget
        pieChartService.get(graph.config).then(function(response){
          graph.load = false;
          graph.label = response.label; // Bind the result in the model
          graph.value = response.value;
          graph.chart.series[0].setData(response.series);
        });
      });
    }

    // PNG export
    this.export = function($event){

      // IE
      if (graph.chart.chart.canvas.msToBlob){
        var blob = graph.chart.chart.canvas.msToBlob();
        window.navigator.msSaveBlob(blob, 'graph.png')
      }
      else {
        var img = graph.chart.toBase64Image();
        img = img.replace('image/png', 'image/octet-stream');
        $event.currentTarget.href = img;
        $event.currentTarget.download = 'graph.png';
      }
    }

    this.open = function(name){
      // Get the label of the clicked segemnt -->  console.log(points[0]._model.label);
      // Build the condition to obtain the data
      // To do this, add a rule : column selected = label of the part who has been cliked
      var condi =angular.copy(graph.config); // Do a copy to not impact the widget configuration
      condi.condition.group.rules.push({condition: '=', field: graph.config.columnStandard ,data: name})
      var modalInstance = $uibModal.open({
        templateUrl : '{widgetsPath}/pieChart/src/view/modal.html',
        controller : 'modalInstanceCtrl',
        controllerAs : 'cm',
        size : 'lg',
        windowClass: 'my-modal',
        resolve: {
          data: ['modalServicePC', function(modalService){
            return modalService.fetch(condi);
          }]
        }
      });
    }

    if (graph.config.mode == 'std'){
      graph.options.plotOptions.series = {
        cursor: 'pointer',
        events: {
          click: function(event){
            graph.open(this.name);
          }
        }
      }
    }
    angular.element(document).ready(function(){
      graph.chart = Highcharts.chart(graph.id, graph.options);
    })
  }
  // Only build the graph when all option are config
}
pieChartController.$inject = ["$scope", "data", "pieChartService", "$rootScope", "$uibModal"];



angular.module('adf.widget.pieChart')
  .service('modalServicePC', modalService);

function  modalService($q, $http, $parse){

  function createColumns(config, model){
    var columns = [];


    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        var title = col.title.replace(/_/, ' ');
        title = title.replace(/^bool/, '');
        model.headers[i] = col.title;
        columns.push({
          title: col.title,
          path: $parse(col.path)
        });
      }
    });

    return columns;
  }

  function createDataModel(config, data){
    var model = {
      headers: [],
      rows: [],
    };
    if (!config.columns){
        config.columns = [];
        for (var key in data[0]){
          config.columns.push({title : key, path : key});
        }
    }

    var root = data;
    if (config.rootData){
      root = $parse(config.rootData)(data);
    }

    var columns = createColumns(config, model);
    angular.forEach(root, function(node){
      var row = [];

      angular.forEach(columns, function(col, i){
        var value = col.path(node);
        row[i] = value;
      });

      model.rows.push(row);
    });
    model.totalItems = model.rows.length;
    model.columns = config.columns;
    config.condition.group.rules.pop();
    return model;
  }

  function fetch(config){
    return $http.post('/standard', config)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }
  //
  // function get(config){
  //   console.log(config)
  //   var result = null;
  //   if (config){
  //     result = createDataModel(config.config, config.data);
  //   }
  //   return result;
  // }

  return {fetch : fetch};

}
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.pieChart')
  .controller('modalInstanceCtrl', modalInstanceCtrl);


  function modalInstanceCtrl(data){

    var cm = this;
    this.data = data;

    this.sortIndex = function(index){
      cm.reverseSort = !cm.reverseSort;
      return cm.orderField = index;
    }

    this.sorter = function(item){
      return item[cm.orderField];
    }
  }
  modalInstanceCtrl.$inject = ["data"];



angular.module('adf.widget.pieChart')
  .controller('pieChartEditController', pieChartEditController);

function pieChartEditController($scope, $http, config, pieChartService){
  var graph = this;
  this.config = config;
  config.datasource = {};


  if (!graph.config.principalCol)
    graph.config.principalCol = [];
  if(!graph.config.otherCol)
    graph.config.otherCol = [];
  if (!config.condition)
    config.condition = {'group' : {'operator' : 'AND', 'rules' : []}};
  if(!config.condition2)
    config.condition2 = {'group' : {'operator' : 'AND', 'rules' : []}};

  this.getDatabase = function(){
    return $http.get('/standard')
      .then(function(response){

        return response.data;
      });
  }

  function getRefColumn(arrayCol){
    graph.config.principalCol = [];
    graph.config.otherCol = [];
    arrayCol.forEach(function(el){
      if(el.type == 'principal'){
        graph.config.principalCol.push(el)
      }
      else {
        graph.config.otherCol.push(el);
      }
    });
  }

  this.getColumns = function(val){
    return $http.get('/standard/columns', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    }).then(function(data){
      getRefColumn(data);
      graph.column = data;
    });
  }
}
pieChartEditController.$inject = ["$scope", "$http", "config", "pieChartService"];



angular.module('adf.widget.pieChart')
  .service('pieChartService', pieChartService);

function pieChartService($q, $http, $parse){
  var expertUrl = "/expert/query";
  var standardUrl = "/standard/graph";
  var label = [];
  var value = [];
  var series = [];

  function createData(jsonData, config){

    var getLabel, getValue;
    config.key = [];

    for (var key in jsonData[0]){
      config.key.push(key);
    }

    if(!config.label)
      config.label = config.key[0];

    if(!config.value)
      config.value = config.key[1];

    getLabel = $parse(config.label);
    getValue = $parse(config.value);

    series = jsonData.map(function(el){
      return {name : getLabel(el), y : getValue(el), sliced : config.sliced}
    });
    console.log(series);
    label = jsonData.map(function(u){return getLabel(u);});
    value = jsonData.map(function(u){return getValue(u);});
    return {config : config, label: label, value: value, type: config.type, desc : config.desc, series : series};
  }

  function fetch(config){
    var url = config.url.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createData(data, config);
      });
  }

  function get(config){
    var result = null;
    if (config.mode == 'exp'){
      result = post(config, expertUrl);
    }
    else if (config.mode == 'std'){
      result = post(config, standardUrl);
    }
    else if (config.mode == 'easy'){
      if (config.datasource.selected)
        config.url = config.datasource.selected.url;
      result = fetch(config);
    }
    return result
  }

  function post(config, url){
    return $http.post(url, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createData(data, config);
      });
  }


  return {
    get: get
  };
}
pieChartService.$inject = ["$q", "$http", "$parse"];
})(window);