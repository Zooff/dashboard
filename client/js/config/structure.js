angular.module('dashboardInfra')

.config(function(dashboardProvider){
  dashboardProvider
      .structure('3-3-3-3',{
          rows: [{
            columns: [{
                styleClass: 'col-md-3'
              },{
                styleClass: 'col-md-3'
              },{
                styleClass: 'col-md-3'
              },{
                styleClass: 'col-md-3'
              }]
            }]
      })

      .structure('Check Struct',{
          rows: [{
            columns: [{
                styleClass: 'col-md-2'
              },{
                styleClass: 'col-md-2'
              },{
                styleClass: 'col-md-2'
              },{
                styleClass: 'col-md-2'
              },{
                styleClass: 'col-md-2'
              },{
                styleClass: 'col-md-2'
              }]
            }, {
              columns: [{
                styleClass: 'col-md-3'
              },{
                styleClass: 'col-md-3'
              },{
                styleClass: 'col-md-3',
              },{
                styleClass: 'col-md-3'
              }]
            }]
      });
})
