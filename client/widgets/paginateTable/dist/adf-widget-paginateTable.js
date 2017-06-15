(function(window, undefined) {'use strict';


angular.module('adf.widget.paginateTable', ['adf.provider'])
  .config(TableWidget);

function TableWidget(dashboardProvider){
  dashboardProvider
    .widget('paginateTable', {
      title: 'Tableau Paginé',
      description: 'Widget permettant d\'afficher un tableau paginé',
      templateUrl: '{widgetsPath}/paginateTable/src/view/view.html',
      controller: 'paginateTableController',
      controllerAs: 'pt',
      reload: true,
      resolve: {
        data: ["paginateTableService", "config", function(paginateTableService, config){
          return paginateTableService.get(config);
        }]
      },
      edit: {
        controller: 'paginateTableEditController',
        controllerAs: 'pt',
        templateUrl: '{widgetsPath}/paginateTable/src/edit/edit.html'
      }
    });
}
TableWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.paginateTable").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/paginateTable/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><input type=checkbox ng-model=config.master> <label>Master</label><form role=form><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in pt.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=pt.getStandardColumns(config.databaseStandard)></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>SEC</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Colonne</label></div><p>Première configuration automatique</p><div class=\"form-inline padding-bottom\" ng-repeat=\"col in pt.config.columns\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=sr-only for=path-{{$index}}>Path</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required></div><button type=button class=\"btn btn-warning\" ng-click=\"pt.removeColumn(false, $index)\"><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=pt.addColumn(false)><i class=\"fa fa-plus\"></i> Add</button><div><label>Pagination</label></div><div class=form-group><label class=sr-only for=maxSize>Nombre d\'Elément par Page</label> <input type=text id=maxSize class=form-control placeholder=\"Item Per Page\" ng-model=config.itemPerPage></div><div class=form-group><label ng-click=\"isCollapsed = !isCollapsed\">Paramètre Modal <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><div><label for=sample>Modal URL</label><div ng-show=config.modalUrl class=\"alert alert-info text-center\" ng-bind-html=config.modalUrl></div><selecttree model=config.modalDatasource></selecttree></div><div><label for=field>Column to populate</label><select id=field ng-options=\"pt.config.columns.indexOf(col) as col.title for col in pt.config.columns\" ng-model=pt.config.modalField></select></div><div><label>Column</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"modalCol in pt.config.modalColumns\"><div class=form-group><label class=sr-only for=modalTitle-{{$index}}>Title</label> <input type=text id=modalTitle-{{$index}} class=form-control placeholder=Title ng-model=modalCol.title required></div><div class=form-group><label class=sr-only for=modalPath-{{$index}}>Path</label> <input type=text id=modalPath-{{$index}} class=form-control placeholder=Path ng-model=modalCol.path required></div><button type=button class=\"btn btn-warning\" ng-click=\"pt.removeColumn(true, $index)\"><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=pt.addColumn(true)><i class=\"fa fa-plus\"></i> Add</button></div></form>");
$templateCache.put("{widgetsPath}/paginateTable/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/paginateTable/src/view/view.html","<div><div ng-hide=pt.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=pt.data><div class=\"col-md-3 text-center v-cent\"><p>Nombre d\'éléments : {{pt.data.rows.length}}</p></div><div class=\"col-md-3 col-md-offset-6 text-center marg\"><button type=button class=\"btn btn-success\" ng-csv=pt.getData() csv-header=pt.getHeader() field-separator=; filename=\"{{$parent.model.title + \'.csv\'}}\"><i class=\"fa fa-file-excel-o\" aria-hidden=true></i> Export</button></div><br><div class=text-center><input type=search ng-model=q placeholder=Filter class=form-control></div><div class=table-responsive><table class=table><tr><th ng-repeat=\"head in pt.data.headers\" ng-click=pt.sortIndex($index)>{{head}}</th></tr><tr ng-repeat=\"row in filterData = (pt.data.rows | filter:q )| orderBy:pt.sorter:pt.reverseSort| startFrom: (pt.data.currentPage-1)*pt.data.itemPerPage | limitTo:pt.data.itemPerPage track by $index\" ng-click=pt.open(row)><td ng-repeat=\"col in row track by $index\"><span ng-if=\"(col != \'0\') && (col != \'1\')\">{{col}}</span> <span ng-if=\"col == \'0\'\"><i class=\"fa fa-times text-danger\"></i></span> <span ng-if=\"col == \'1\'\"><i class=\"fa fa-check text-success\"></i></span></td></tr></table></div><div class=text-center><ul uib-pagination total-items=filterData.length ng-model=pt.data.currentPage max-size=pt.data.maxSize class=pagination-sm boundary-links=true items-per-page=pt.data.itemPerPage num-pages=numPages></ul></div></div></div>");}]);


angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController($scope, $rootScope, data, $uibModal){

  var pt = this;

  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
    this.orderField = 0;
    this.reverseSort = false;

    // Change the orderBy header
    this.sortIndex = function(index){
      pt.reverseSort = !pt.reverseSort;
      return pt.orderField = index;
    }

    this.sorter = function(item){
      return item[pt.orderField];
    }

    pt.getData = function(){
      return pt.data.rows;
    }

    pt.getHeader = function(){
      return pt.data.headers;
    }


    pt.open = function(row){

      // Master Widget : Broadcast the selected column value
      if(pt.data.config.master){
        $rootScope.$broadcast('DatTest', row[pt.data.config.modalField]);
      }

      // Open the modal
      if(pt.data.config.modalDatasource)
        pt.data.config.modalUrl = pt.data.config.modalDatasource.selected.url;

      if (pt.data.config.modalUrl){
        pt.data.config.urlReplace = row[pt.data.config.modalField];
        var modalInstance = $uibModal.open({
          templateUrl : '{widgetsPath}/paginateTable/src/view/modal.html',
          controller : 'modalInstanceCtrl',
          controllerAs : 'cm',
          resolve: {
            data: ['modalService',function(modalService){
              return modalService.get(pt.data.config);
            }],
          }
        });
      }
    }
  }
}
paginateTableController.$inject = ["$scope", "$rootScope", "data", "$uibModal"];



angular.module('adf.widget.paginateTable')
  .service('modalService', modalService);

function  modalService($q, $http, $parse){

  function createColumns(config, model){
    var columns = [];


    angular.forEach(config.modalColumns, function(col, i){
      if (col.title && col.path) {
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

    if (!config.modalColumns){
        config.modalColumns = [];
        for (var key in data[0]){
          config.modalColumns.push({title : key, path : key});
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
    return model;
  }

  function fetch(config){

    var url = config.modalUrl.replace(/:\w*/, config.urlReplace);
    return $http.get(url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function get(config){
    var result = null;
    if (config.modalDatasource){
      if (config.modalDatasource.selected)
        config.modalUrl = config.modalDatasource.selected.url
      result = fetch(config);
    }
    return result
  }

  return {get : get};

}
modalService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.paginateTable')
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



angular.module('adf.widget.paginateTable')
  .controller('paginateTableEditController', paginateTableEditController);

function paginateTableEditController($scope, $http,config){
  var pt = this;
  this.config = config;

  // Use by the directive selecttree, need to be initialize
  config.datasource = {};
  config.modalDatasource = {};

  // $scope.getAutocompletion = function(val){
  //   return $http.get('/autocomplete', {
  //     params: {
  //       val : val
  //     }
  //   })
  //   .then(function(response){
  //     return response.data;
  //   });
  // }
  if (!pt.config.principalCol)
    pt.config.principalCol = [];
  if(!pt.config.otherCol)
    pt.config.otherCol = [];
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
    pt.config.principalCol = [];
    pt.config.otherCol = [];
    arrayCol.forEach(function(el){
      if(el.type == 'principal'){
        pt.config.principalCol.push(el)
      }
      else {
        pt.config.otherCol.push(el);
      }
    });
  }

  this.getStandardColumns = function(val){
    return $http.get('/standard/columns', {
      params: {
        val : val
      }
    })
    .then(function(response){
      return response.data;
    }).then(function(data){
      getRefColumn(data);
    });
  }

  function getColumns(modal){
    if (!modal && !config.columns){
      config.columns = [];
    }
    if (modal && !config.modalColumns){
      config.modalColumns = [];
    }

    return modal ? config.modalColumns : config.columns;
  }

  this.addColumn = function(modal){
    getColumns(modal).push({});
  };

  this.removeColumn = function(modal,index){
    getColumns(modal).splice(index, 1);
  };
}
paginateTableEditController.$inject = ["$scope", "$http", "config"];



angular.module('adf.widget.paginateTable')
  .service('paginateTableService', paginateTableService);

function paginateTableService($q, $http, $parse){

  var expertUrl = "/expert/query";
  var standardUrl = "/standard/";

  function createColumns(config, model){
    var columns = [];

    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        var title = col.title.replace(/_/, ' ');
        title = title.replace(/^bool/, '');
        model.headers[i] = title;
        columns.push({
          title: title,
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
      itemPerPage : config.itemPerPage
    };

    if (!config.columns || !config.columns.length){
        console.log('FUCK');
        config.columns = [];
        for (var key in data[0]){
          config.columns.push({title : key, path : key});
        }
    }

    var root = data;
    if (config.root){
      root = $parse(config.root)(data);
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
    model.config = config;
    return model;
  }

  function fetch(config){
    return $http.get(config.url)
      .then(function(response){
        return response.data;
      })
      .then(function(data){
        return createDataModel(config, data);
      });
  }

  function post(config, url){
    return $http.post(url, config)
      .then(function(response){
        return response.data
      })
      .then(function(data){
        return createDataModel(config, data);
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


  return {
    get: get
  };
}
paginateTableService.$inject = ["$q", "$http", "$parse"];

angular.module('adf.widget.paginateTable')

.filter('startFrom', function(){
  return function(input, start){
    if (!input || !input.length) {return ;}
    return input.slice(start);
  }
})
})(window);