(function(window, undefined) {'use strict';


angular.module('adf.widget.paginateTable', ['adf.provider', 'dashboardInfra.service'])
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

angular.module("adf.widget.paginateTable").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/paginateTable/src/edit/edit.html","<script type=text/ng-template id=autocomplete.html><a> <span ng-bind-html=\"match.model.url | uibTypeaheadHighlight:query\"></span> | <small ng-bind-html=\"match.model.desc | uibTypeaheadHighlight:query\"></small> </a></script><div class=\"form-inline padding-bottom\"><input type=checkbox ng-model=config.master id=master> <label for=master>Master</label> <input ng-if=\"config.mode == \'easy\' || \'expert\'\" id=listener type=checkbox ng-model=config.listener> <label ng-if=\"config.mode == \'easy\' || \'expert\'\" for=listener>Slave</label><div ng-if=config.listener><label>Master Column</label> <input type=text ng-model=config.slaveValue></div></div><form role=form><hr><input type=radio ng-model=config.mode value=easy id=easy> <label for=easy>Mode Facile</label> <input type=radio ng-model=config.mode value=std id=std> <label for=std>Mode Standard</label> <input type=radio ng-model=config.mode value=exp id=exp> <label for=exp>Mode Expert</label><div class=form-group ng-if=\"config.mode == \'easy\'\"><easy-mode config=config><easy-mode></easy-mode></easy-mode></div><div class=form-group ng-if=\"config.mode == \'std\'\"><div class=form-group><label for=sample>Datasources</label> <input id=sample type=text class=form-control ng-model=config.databaseStandard placeholder=\"Type du Check\" autocomplete=off uib-typeahead=\"database for database in pt.getDatabase($viewValue)\" typeahead-min-length=0 typeahead-on-select=pt.getStandardColumns(config.databaseStandard)></div><div class=form-group><label for=standardTest>Condition :</label></div><p ng-hide=config.principalCol.length>Choissisez une datasource !</p><div ng-if=config.principalCol.length><label><small>Choix de la Référence</small></label><query-builder group=config.condition.group fields=config.principalCol database=config.databaseStandard></query-builder></div><div ng-if=\"config.condition.group.rules[0] && config.condition.group.rules[0].data\"><label><small>Conditions Optionnelles</small></label><query-builder group=config.condition2.group fields=config.otherCol database=config.databaseStandard></query-builder></div></div><div ng-if=\"config.mode == \'exp\'\"><expert-mode config=config></expert-mode></div><hr><div><label>Colonne</label></div><p>Première configuration automatique</p><div ng-repeat=\"col in pt.config.columns\"><div class=\"form-inline padding-bottom\"><div class=form-group><label class=ctm-label for=title-{{$index}}>Nom de la colonne :</label> <input type=text id=title-{{$index}} class=form-control placeholder=Title ng-model=col.title required></div><div class=form-group><label class=ctm-label for=path-{{$index}}>Chemin d\'accès :</label> <input type=text id=path-{{$index}} class=form-control placeholder=Path ng-model=col.path required autocomplete=off uib-typeahead=\"key for key in config.keys\" typeahead-min-length=0></div></div><div class=\"form-inline padding-bottom\" ng-init=\"col.opt = {}\"><label for=opt-{{$index}}>Booléen</label> <input type=radio id=opt-{{$index}} ng-model=col.opt.type value=bool> <label for=opt4-{{$index}}>Check</label> <input type=radio id=opt4-{{$index}} ng-model=col.opt.type value=check> <label for=opt2-{{$index}}>Seuil</label> <input type=radio id=opt2-{{$index}} ng-model=col.opt.type value=seuil> <label for=opt3-{{$index}}>Pourcentage</label> <input type=radio id=opt3-{{$index}} ng-model=col.opt.type value=pourcent> <label for=opt4-{{index}}>Date</label> <input type=radio id=opt4-{{index}} ng-model=col.opt.type value=date></div><div class=\"form-inline padding-bottom\" ng-if=\"col.opt.type ==\'pourcent\'\"><label for=ip>Inverser les couleurs</label> <input id=ip type=checkbox ng-model=col.opt.inversePourcent></div><div class=\"form-inline padding-bottom\" ng-if=\"col.opt.type == \'seuil\'\"><select ng-model=col.opt.seuilOp><option value=Sup>Sup</option><option value=Inf>Inf</option><option value=Eg>Egal</option></select><input type=text ng-model=col.opt.seuilVal></div><div class=\"form-inline padding-bottom\" ng-if=\"col.opt.type == \'date\'\"><label for=format>Format de la Date</label><select ng-model=col.opt.dateFormat><option value=DD-MM-YYYY>Day - Month - Year</option><option value=DD-MMM>Day - Month</option><option value=DD-HH>Day</option><option value=X>Timestamp</option></select></div><button type=button class=\"btn btn-warning\" ng-click=\"pt.removeColumn(false, $index)\"><i class=\"fa fa-minus\"></i> Remove</button><hr></div><br><button type=button class=\"btn btn-primary\" ng-click=pt.addColumn(false)><i class=\"fa fa-plus\"></i> Add</button><hr><div><input type=checkbox id=header ng-model=config.head> <label for=header>Cacher l\'en-tête</label></div><div><input type=checkbox id=filter ng-model=config.filter> <label for=filter>Cacher le Filtre</label></div><div><label for=clear>Effacer les colonnes à chaque chargement</label> <input type=checkbox ng-model=config.clear id=clear></div><div><label>Pagination</label></div><div class=form-group><label class=sr-only for=maxSize>Nombre d\'Elément par Page</label> <input type=text id=maxSize class=form-control placeholder=\"Nombre d\'élément par pages\" ng-model=config.itemPerPage></div><div class=form-group><p>Si vous avez choissis un type date pour une colonne veuillez spécifier le format de la date de la BDD</p><label class=ctm-label for=df>Format</label> <input type=text placeholder=\"Par Default : YYYY-MM-DDTHH:mm:ssZ\" ng-model=config.dateFormat></div><div class=form-group><label ng-click=\"isCollapsed = !isCollapsed\">Paramètre Optionnel <span ng-hide=isCollapsed class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=true></span> <span ng-show=isCollapsed class=\"glyphicon glyphicon-triangle-top\" aria-hidden=true></span></label></div><div ng-show=isCollapsed><hr><div><label for=field>Column to populate</label></div><div class=\"form-inline padding-bottom\" ng-repeat=\"c in pt.config.colToPop\"><div class=form-group><input type=text id=field autocomplete=off uib-typeahead=\"key for key in config.keys\" typeahead-min-length=0 ng-model=c.name></div><button type=button class=\"btn btn-warning\" ng-click=pt.removeColToPop($index)><i class=\"fa fa-minus\"></i> Remove</button></div><button type=button class=\"btn btn-primary\" ng-click=pt.addColToPop()><i class=\"fa fa-plus\"></i> Add</button><hr><my-link config=config></my-link><hr><label>Modal Configuration</label><modal-config config=config></modal-config></div></form>");
$templateCache.put("{widgetsPath}/paginateTable/src/view/modal.html","<modal-table data=cm.data></modal-table>");
$templateCache.put("{widgetsPath}/paginateTable/src/view/view.html","<div><div ng-hide=pt.data class=\"alert alert-info\" role=alert>Please insert a url to the widget configuration</div><div ng-show=pt.data><div class=row><div ng-if=!pt.data.config.head class=col-md-12><div class=\"col-md-6 text-center v-cent\"><p>Nombre d\'éléments : {{pt.data.rows.length}}</p></div><div class=\"col-md-6 text-center marg\"><button type=button class=\"btn btn-success\" ng-csv=pt.getData() csv-header=pt.getHeader() field-separator=; filename=\"{{$parent.model.title + \'.csv\'}}\"><i class=\"fa fa-file-excel-o\" aria-hidden=true></i> Export</button></div><br></div></div><div class=text-center ng-show=!config.filter><input type=search ng-model=q placeholder=Filter class=form-control></div><div ng-show=!pt.load class=table-responsive><table class=table><tr><th class=text-center ng-repeat=\"head in pt.data.headers\" ng-click=pt.sortIndex($index)>{{head}}</th></tr><tr ng-repeat=\"row in filterData = (pt.data.rows | myfilter:pt.data.headers:q | orderBy:pt.sorter:pt.reverseSort) | startFrom: (pt.data.currentPage-1)*pt.data.itemPerPage | limitTo:pt.data.itemPerPage track by $index\" ng-click=pt.open(row)><td ng-repeat=\"col in row track by $index\" ng-switch=col.opt.type ng-if=\"col.opt != \'hidden\'\" ng-class=\"{click : pt.data.config.master || pt.data.config.modalUrl}\"><span ng-switch-default>{{col.value}}</span><span ng-switch-when=bool ng-if=\"(col.value != \'0\') && (col.value != \'1\')\">{{col.value}}</span> <span ng-switch-when=bool ng-if=\"col.value == \'0\'\"><i class=\"fa fa-times text-danger\"></i></span> <span ng-switch-when=bool ng-if=\"col.value == \'1\'\"><i class=\"fa fa-check text-success\"></i></span><span ng-switch-when=seuil ng-if=\"pt.verifSeuil(col.value, col.opt.seuilOp, col.opt.seuilVal)\" class=text-success>{{col.value}}</span> <span ng-switch-when=seuil ng-if=\"!pt.verifSeuil(col.value, col.opt.seuilOp, col.opt.seuilVal)\" class=text-danger>{{col.value}}</span><span ng-switch-when=pourcent ng-if=\"col.value < 0\" class=\"fa fa-arrow-down\" ng-class=\"{\'text-success\' : !col.opt.inversePourcent, \'text-danger\': col.opt.inversePourcent}\" uib-tooltip={{col.value}}%></span> <span ng-switch-when=pourcent ng-if=\"col.value > 0\" class=\"fa fa-arrow-up\" ng-class=\"{\'text-success\' : col.opt.inversePourcent, \'text-danger\': !col.opt.inversePourcent}\" uib-tooltip={{col.value}}%></span> <span ng-switch-when=pourcent ng-if=\"col.value == 0\" class=\"fa fa-arrow-right text-warning\" uib-tooltip={{col.value}}%></span><span ng-switch-when=check ng-if=\"col.value > 0\"><i class=\"fa fa-times text-danger\" uib-tooltip={{col.value}}></i></span> <span ng-switch-when=check ng-if=\"col.value == 0\"><i class=\"fa fa-check text-success\" uib-tooltip={{col.value}}></i></span><span ng-switch-when=date>{{pt.formatDate(col.value, col.opt.dateFormat)}}</span></td></tr></table></div><div ng-if=\"pt.data.rows.length == 0\" class=text-center><span><i class=\"fa fa-flag\"></i> No Result Found</span></div><div ng-hide=!pt.load class=text-center><i class=\"fa fa-spinner fa-pulse fa-3x\" aria-hidden=true></i></div><div class=text-center ng-if=\"filterData.length > pt.data.itemPerPage\"><ul uib-pagination total-items=filterData.length ng-model=pt.data.currentPage max-size=5 class=pagination-sm boundary-links=true items-per-page=pt.data.itemPerPage num-pages=numPages></ul></div></div></div>");}]);


angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController($scope, $rootScope, data, $uibModal, paginateTableService, link){

  var pt = this;

  pt.load = false;

  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
    this.orderField = 0;
    this.reverseSort = false;
    this.first = true;

    // Change the orderBy header
    this.sortIndex = function(index){
      pt.first = false;
      pt.reverseSort = !pt.reverseSort;
      return pt.orderField = index;
    }

    this.sorter = function(item){
      if (pt.first)
        return
      return item[pt.orderField].value;
    }

    pt.getData = function(){
      // We need to remove nested objects from data.rows to use ngCsv
      var array = angular.copy(pt.data.rows)
      for (var row = 0; row < array.length; row++){
        for (var r = 0; r < array[row].length; r++){
          array[row][r] = array[row][r].value
        }
      }

      return array;
    }

    pt.getHeader = function(){
      return pt.data.headers;
    }

    if (pt.data.config.listener){
      $scope.$on('DatTest', function(events, args){
        pt.data.config.expertReplace = args;
        pt.data.config.urlReplace = args[pt.data.config.slaveValue];
        pt.load = true;
        paginateTableService.get(pt.data.config).then(function(response){
          pt.load = false;
          pt.data = response;
          pt.data.maxSize = 5;
          pt.data.currentPage = 1;
        })
      })
    }

    pt.verifSeuil = function(val, seuilOp, seuilVal){
      if (!isNaN(val)){
        if (seuilOp == 'Sup'){
          return val > seuilVal;
        }
        if (seuilOp == 'Inf'){
          return val < seuilVal;
        }
      }
    }

    pt.formatDate = function(value,format){
      if (!pt.data.config.dateFormat)
        pt.data.config.dateFormat = "YYYY-MM-DDTHH:mm:ssZ"
      return moment(value, pt.data.config.dateFormat).format(format);
    }

    // Click on the tab
    pt.open = function(row){

      // If not master or not had a modal, do nothing
      if(!pt.data.config.master && !pt.data.config.modalDatasource.selected && !pt.data.config.modalUrl )
        return;

      if (pt.data.config.expertReplace){
        var broadcastEl = pt.data.config.expertReplace;
      }
      else {
        var broadcastEl = {};
      }
      if (pt.data.config.colToPop){
        pt.data.config.colToPop.forEach(function(col){
          // broadcastEl[col.name] = lodash.find(row,function(el){
          broadcastEl[col.name] = row.find(function(el){
            return el.title == col.name;
          }).value;
        })
      }

      // Master Widget : Broadcast the selected column value
      if(pt.data.config.master){
        $rootScope.$broadcast('DatTest',broadcastEl);
        return;
      }

      if(pt.data.config.link){
        link.redirect(pt.data.config, broadcastEl);
        return;
      }

      // Open the modal
      if(pt.data.config.modalDatasource.selected)
        pt.data.config.modalUrl = pt.data.config.modalDatasource.selected.url;

      if (pt.data.config.modalUrl){
        pt.data.config.urlReplace = broadcastEl[pt.data.config.colToPop[0].name];
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
paginateTableController.$inject = ["$scope", "$rootScope", "data", "$uibModal", "paginateTableService", "link"];



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
  config.urlReplace = '0'; // Init the slave Mode



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

  function getColToPop(){
    if (!config.colToPop)
      config.colToPop = [];
    return config.colToPop;
  };

  // Use by the typeahead directive to generate a User friendly Label
  this.formatLabel = function(model){
    return config.keys[model];
  };

  this.addColToPop = function(){
    getColToPop().push({});
  };

  this.removeColToPop = function(index){
    getColToPop().splice(index, 1)
  };

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

    // Add the column want by the user
    angular.forEach(config.columns, function(col, i){
      if (col.title && col.path) {
        model.headers[i] = col.title;
        columns.push({
          title: col.title,
          path: $parse(col.path),
          opt : col.opt
        });
      }
    });

    // Obtain the columns that the user dont want to see
    var diff = config.keys.filter(function(x){
      return !config.columns.find(function(el){
        return el.title == x;
      })
    });

    // Add them to be used by the master mode
    angular.forEach(diff, function(col2, i2){
      columns.push({
        title: col2,
        path: $parse(col2),
        opt: 'hidden'
      });
    });

    return columns;
  }

  function createDataModel(config, data){
    var model = {
      headers: [],
      rows: [],
      itemPerPage : config.itemPerPage
    };
    config.keys = [];


    // Master widget column broadcast
    for (var k in data[0]){
        config.keys.push(k);
    }

    if (config.clear){
      config.columns = [];
    }

    // Conf auto
    if (!config.columns || !config.columns.length){
        config.columns = [];
        for (var key in data[0]){
          var t = key.replace(/_/g, ' ');
          t = t.replace(/^bool/, '');
          config.columns.push({title : t, path : key, col : null});
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
        row[i] = {value : value, opt : col.opt, title: col.title};
      });

      model.rows.push(row);
    });
    model.totalItems = model.rows.length;
    model.columns = config.columns;
    model.config = config;
    return model;
  }

  function fetch(config){
    var url = config.url.replace(/:\w+/, config.urlReplace)
    return $http.get(url)
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

// Filter the column if specified --> ColName:Value
.filter('myfilter', function(){
  return function(items, head, search){
    if (!search){
      return items;
    }
    var match = search.match(/\w+:\w+/gi);

    if (match.length ==1){
      var idx = head.indexOf(search.match(/\w+/)[0])
      var test = search.match(/:\w+/)[0].substr(1)
      return items.filter(function(el, index, array){
          var text = el[idx].value;
          if (typeof(text) == "number"){
            text += "";
          }
          return text.indexOf(test) > -1;
      })
    }
    else if (match.length > 1){
      return items.filter(function(elem, index, array){
        return match.every(function(el){
          var idx = head.indexOf(el.match(/\w+/)[0]);
          var test = el.match(/:\w+/)[0].substr(1)
          var text = elem[idx].value;
          if (typeof(text) == "number"){
            text += "";
          }
          return text.indexOf(test) > -1;
        })
      })
    }
    else {
      return items.filter(function(elem, index, array){
        return elem.some(function(el){
          var text = el.value
          if (typeof(text) == "number"){
            text += "";
          }
          return text.indexOf(search) > -1;
        })
      })
    }
  }
})
})(window);