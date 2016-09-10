'use strict';

const printString = require('../printString');

const reactElement = Symbol.for('react.element');

function traverseChildren(opaqueChildren, cb) {
  if (Array.isArray(opaqueChildren)) {
    opaqueChildren.forEach(child => traverseChildren(child, cb));
  } else if (opaqueChildren != null && opaqueChildren !== false) {
    cb(opaqueChildren);
  }
}

function printChildren(flatChildren, print, indent, lineSeparator) {
  return flatChildren.map(node => {
    if (typeof node === 'object') {
      return printElement(node, print, indent, lineSeparator);
    } else if (typeof node === 'string') {
      return printString(node);
    } else {
      return print(node);
    }
  }).join(lineSeparator);
}

function printProps(props, print, indent, lineSeparator) {
  return Object.keys(props).sort().map(name => {
    if (name === 'children') {
      return '';
    }

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

function printElement(element, print, indent, lineSeparator) {
  let result = '<' + element.type;
  result += printProps(element.props, print, indent, lineSeparator);

  const opaqueChildren = element.props.children;
  if (opaqueChildren) {
    let flatChildren = [];
    traverseChildren(opaqueChildren, child => {
      flatChildren.push(child);
    });
    const children = printChildren(flatChildren, print, indent, lineSeparator);
    result += '>' + lineSeparator + indent(children) + lineSeparator + '</' + element.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactElement;
  },
  print(val, print, indent, lineSeparator) {
    return printElement(val, print, indent, lineSeparator);
  }
};
