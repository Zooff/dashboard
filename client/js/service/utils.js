angular.module('dashboardInfra.service')

.service('utils', function(){
  return {

    // Use for right
    getEnv : function(id){
      if (id.indexOf('_wds') > -1)
        return "windows";
      if (id.indexOf('_unix') > -1)
        return "unix";
      if (id.indexOf('_dba') > -1)
        return "dba";
      return "";
    }
  }
})
