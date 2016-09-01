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

function printChildren(flatChildren, print, indent) {
  return flatChildren.map(node => {
    if (typeof node === 'object') {
      return printElement(node, print, indent);
    } else if (typeof node === 'string') {
      return printString(node);
    } else {
      return print(node);
    }
  }).join('\n');
}

function printProps(props, print, indent) {
  return Object.keys(props).sort().map(name => {
    if (name === 'children') {
      return '';
    }

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
  let result = '<' + element.type;
  result += printProps(element.props, print, indent);

  const opaqueChildren = element.props.children;
  if (opaqueChildren) {
    let flatChildren = [];
    traverseChildren(opaqueChildren, child => {
      flatChildren.push(child);
    });
    const children = printChildren(flatChildren, print, indent);
    result += '>\n' + indent(children) + '\n</' + element.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactElement;
  },
  print(val, print, indent) {
    return printElement(val, print, indent);
  }
};
