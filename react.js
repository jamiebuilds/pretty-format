var prettyFormat = require('./index');

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

var jsxPlugin = {
  test: function(val, state) {
    return state[inJSX] && val && val.type || val.$$typeof === reactTestInstance;
  },
  print: function(val, print, indent, state) {
    var result = '';
    state[inJSX] = true;

    result += '<' + val.type;

    if (val.props) {
      Object.keys(val.props).forEach(function(name) {
        var prop = val.props[name];
        var printed = print(prop);

        result += ' ' + name + '=';

        if (typeof prop === 'string') {
          result += printed;
        } else {
          result += '{' + printed + '}';
        }
      });
    }

    if (val.children) {
      result += '>\n';

      result += val.children.map(function(child) {
        return indent(print(child));
      }).join('\n');

      result += '\n</' + val.type + '>';
    } else {
      result += '/>';
    }

    state[inJSX] = false;
    return result;
  }
};

var result = prettyFormat(exampleJSX, {
  plugins: [jsxPlugin]
});

console.log(result);
