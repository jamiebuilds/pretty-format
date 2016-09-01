'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent) {
  return children.map(child => printInstance(child, print, indent)).join('\n');
}

function printProps(props, print, indent) {
  return Object.keys(props).sort().map(name => {
    const prop = props[name];
    let printed = print(prop);

    if (typeof prop !== 'string') {
      if (printed.indexOf('\n') !== -1) {
        printed = '{\n' + indent(indent(printed) + '\n}');
      } else {
        printed = '{' + printed + '}';
      }
    }

    return '\n' + indent(name + '=') + printed;
  }).join('');
}

function printInstance(instance, print, indent) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(instance);
  }

  let result = '<' + instance.type;

  if (instance.props) {
    result += printProps(instance.props, print, indent);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent);
    result += '>\n' + indent(children) + '\n</' + instance.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent) {
    return printInstance(val, print, indent);
  }
};
