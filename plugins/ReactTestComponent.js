'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent, lineSeparator) {
  return children.map(child => printInstance(child, print, indent, lineSeparator)).join(lineSeparator);
}

function printProps(props, print, indent, lineSeparator) {
  return Object.keys(props).sort().map(name => {
    const prop = props[name];
    let printed = print(prop);

    if (typeof prop !== 'string') {
      if (printed.indexOf('\n') !== -1) {
        printed = '{' + lineSeparator + indent(indent(printed) + lineSeparator + '}');
      } else {
        printed = '{' + printed + '}';
      }
    }

    return lineSeparator + indent(name + '=') + printed;
  }).join('');
}

function printInstance(instance, print, indent, lineSeparator) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(instance);
  }

  let result = '<' + instance.type;

  if (instance.props) {
    result += printProps(instance.props, print, indent, lineSeparator);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent, lineSeparator);
    result += '>' + lineSeparator + indent(children) + lineSeparator + '</' + instance.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent, lineSeparator) {
    return printInstance(val, print, indent, lineSeparator);
  }
};
