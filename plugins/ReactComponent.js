'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');
const reactInstance = Symbol.for('react.element');

function printChildren(children, print, indent) {
  return Array.isArray(children)
    ? children.map(child => printChildren(child, print, indent)).join('\n')
    : printElement(children, print, indent);
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
    const props = Object.assign({}, element.props);
    delete props.children;
    result += printProps(props, print, indent);
  }

  let children = element.children || element.props.children;
  if (children) {
    const printedChildren = printChildren(children, print, indent);
    result += '>\n' + indent(printedChildren) + '\n</' + element.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return (
      object &&
      (
        object.$$typeof === reactInstance ||
        object.$$typeof === reactTestInstance
      )
    );
  },
  print(val, print, indent) {
    return printElement(val, print, indent);
  }
};
