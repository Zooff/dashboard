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
