'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent) {
  return children.map(child => printElement(child, print, indent)).join('\n');
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

function printElement(element, print, indent) {
  if (typeof element == 'number') {
    return print(element);
  } else if (typeof element === 'string') {
    return printString(element);
  }

  let result = '<' + element.type;

  if (element.props) {
    result += printProps(element.props, print, indent);
  }

  if (element.children) {
    const children = printChildren(element.children, print, indent);
    result += '>\n' + indent(children) + '\n</' + element.type + '>';
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
    return printElement(val, print, indent);
  }
};
