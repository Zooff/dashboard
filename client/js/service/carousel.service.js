angular.module('dashboardInfra.service')

.service('carouselService', function($http, $q){
  return {
    getAll: function(){
      var deferred = $q.defer();
      $http.get('/carousel')
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    },

    add: function(text){
      var deferred = $q.defer();
      $http.post('/carousel', {text : text})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(){
          deferred.reject();
        });
      return deferred.promise;
    },

    remove: function(id){
      var deferred = $q.defer();
      $http.delete('/carousel/' + id)
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
