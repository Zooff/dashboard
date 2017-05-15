angular.module('dashboardInfra.service', [])

.service('storeService', function($http, $q){
  return {
    getAll: function(){
      var deferred = $q.defer();
      $http.get('/dashboard')
        .success(function(data){
          deferred.resolve(data.dashboards);
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    },
    get: function(id){
      var deferred = $q.defer();
      $http.get('/dashboard/' + id)
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    },
    set: function(id, data){
      var deferred = $q.defer();
      $http.post('/dashboard/' + id, data)
        .success(function(data){
          deferred.resolve();
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    },
    delete: function(id){
      var deferred = $q.defer();
      $http.delete('/dashboard/' + id)
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    }
  };
})
