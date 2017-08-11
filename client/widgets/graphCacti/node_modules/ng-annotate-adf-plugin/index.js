/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


module.exports = {

  init: function(_ctx) {
  },

  match: function(node) {
    // dashboardProvider.widget("name", {
    //   ...
    //   controller: function($scope) {},
    //   resolve: {f: function($scope) {}, ..}
    // })

    function matchResolve(props) {
      var resolveObject = matchProp("resolve", props);
      if (resolveObject && resolveObject.type === "ObjectExpression") {
        return resolveObject.properties.map(function(prop) {
          return prop.value;
        });
      }
      return [];
    };

    function matchProp(name, props) {
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if ((prop.key.type === "Identifier" && prop.key.name === name) ||
            (prop.key.type === "Literal" && prop.key.value === name)) {
            return prop.value; // FunctionExpression or ArrayExpression
        }
      }
      return null;
    }

    function last(arr) {
      return arr[arr.length - 1];
    }

    var callee = node.callee;
    if (!callee){
      return false;
    }

    var obj = callee.object;
    if (!obj){
      return false;
    }

    // identifier or expression
    if (!(obj.$chained === 1 || (obj.type === "Identifier" && obj.name === "dashboardProvider"))) {
      return false;
    }

    node.$chained = 1;

    var method = callee.property; // identifier
    if (method.name !== "widget") {
      return false;
    }

    var args = node.arguments;
    if (args.length !== 2) {
      return false;
    }
    var configArg = last(args)
    if (configArg.type !== "ObjectExpression") {
      return false;
    }

    var props = configArg.properties;
    var res = [
      matchProp("controller", props)
    ];
    // {resolve: ..}
    res.push.apply(res, matchResolve(props));

    // edit: {controller: function(), resolve: {}}
    var edit = matchProp('edit', props);
    if (edit && edit.type === "ObjectExpression"){
      var editProps = edit.properties;
      res.push(matchProp('controller', editProps));
      res.push.apply(res, matchResolve(editProps));
    }

    var filteredRes = res.filter(Boolean);
    return (filteredRes.length === 0 ? false : filteredRes);
  }
};
