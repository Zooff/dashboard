'use strict';

angular.module('adf.widget.paginateTable')
  .controller('paginateTableController', paginateTableController);

function paginateTableController(data, $filter){
  if (data) {
    this.data = data;
    this.data.currentPage = 1;
    this.data.maxSize = 5;
  }



  console.log(data)
}
