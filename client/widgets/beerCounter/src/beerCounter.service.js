'use strict';

angular.module('adf.widget.beerCounter')
  .service('beerService', beerService);

function beerService($q, $http, $parse){
  var url = "api/beers";
  var data = [];
  var user = [];
  var value = [];

  function removeBeer(id){
      if (data[id].beer >= 1){
        data[id].beer--;
      }
      value[id] = data[id].beer;
      post(data);
  }

  function addBeer(id){
    data[id].beer++;
    value[id] = data[id].beer;
    post(data);
  }

  function addUser(name){
    data.push({user: name, beer: 1});
    user.push(name);
    value.push(1);
    post(data);
  }

  function createData(jsonData){
    data = jsonData;
    user = jsonData.map(function(u){return u.user;});
    value = jsonData.map(function(u){return u.beer;});
    return {data: data, user: user, value: value};
  }

  function fetch(url){
    return $http.get(url)
      .then(function(response){
        if (response.data){
          return createData(response.data);
        }
        return data;
      }, function(){
        console.log('Error URL');
        return data = [];
      });
  }

  function get(){
    var result = null;
    if (url){
      result = fetch(url);
    }
    return result
  }

  function post(data){
    return $http.post(url, data);
  }

  return {
    get: get,
    addUser : addUser,
    addBeer : addBeer,
    removeBeer : removeBeer,
    user : user,
    value : value
  };
}
