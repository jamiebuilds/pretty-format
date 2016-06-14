var prettyFormat = require('./index');
var isString = require('lodash/isString');

var reactTestInstance = Symbol.for('react-test-instance');
var inJSX = Symbol('inJSX');

var exampleJSX = {
  $$typeof: reactTestInstance,
  type: 'div',
  props: null,
  children: [{
    type: 'a',
    props: { role: 'link' },
    children: null
  }]
};

function printElement(val, print, indent) {
  var result = '<' + val.type;

  if (val.props) {
    Object.keys(val.props).forEach(function(name) {
      var prop = val.props[name];
      var printed = print(prop);

      result += ' ' + name + '=';

      if (isString(prop)) {
        result += printed;
      } else {
        result += '{' + printed + '}';
      }
    });
  }

  if (val.children) {
    result += '>\n';

    result += val.children.map(function(child) {
      var printed;

      if (isString(child)) {
        printed = print(child);
      } else {
        printed = printElement(child, print, indent);
      }

      return indent(printed);
    }).join('\n');

    result += '\n</' + val.type + '>';
  } else {
    result += '/>';
  }

  return result;
}

var jsxPlugin = {
  test: function(val, state) {
    return val.$$typeof === reactTestInstance;
  },
  print: function(val, print, indent) {
    return printElement(val, print, indent);
  }
};

var result = prettyFormat(exampleJSX, {
  plugins: [jsxPlugin]
});

console.log(result);
