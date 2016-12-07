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

function printChildren(flatChildren, print, indent, output, opts) {
  return flatChildren.map(node => {
    if (typeof node === 'object') {
      return printElement(node, print, indent, output, opts);
    } else if (typeof node === 'string') {
      return printString(output.content.open + node + output.content.close);
    } else {
      return print(node);
    }
  }).join(opts.edgeSpacing);
}

function printProps(props, print, indent, output, opts) {
  return Object.keys(props).sort().map(name => {
    if (name === 'children') {
      return '';
    }

    const prop = props[name];
    let printed = print(prop);

    if (typeof prop !== 'string') {
      if (printed.indexOf('\n') !== -1) {
        printed = '{' + opts.edgeSpacing + indent(indent(printed) + opts.edgeSpacing + '}');
      } else {
        printed = '{' + printed + '}';
      }
    }

    return opts.spacing + indent(output.prop.open + name + output.prop.close + '=') + output.value.open + printed + output.value.close;
  }).join('');
}

function printElement(element, print, indent, output, opts) {
  let result = output.tag.open + '<';
  let elementName;
  if (typeof element.type === 'string') {
    elementName = element.type;
  } else if (typeof element.type === 'function') {
    elementName = element.type.displayName || element.type.name || 'Unknown';
  } else {
    elementName = 'Unknown';
  }
  result += elementName + output.tag.close;
  result += printProps(element.props, print, indent, output, opts);

  const opaqueChildren = element.props.children;
  if (opaqueChildren) {
    let flatChildren = [];
    traverseChildren(opaqueChildren, child => {
      flatChildren.push(child);
    });
    const children = printChildren(flatChildren, print, indent, output, opts);
    result += output.tag.open + '>' + output.tag.close + opts.edgeSpacing + indent(children) + opts.edgeSpacing + output.tag.open + '</' + elementName + '>' + output.tag.close;
  } else {
    result += output.tag.open + ' />' + output.tag.close;
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactElement;
  },
  print(val, print, indent, output, opts) {
    return printElement(val, print, indent, output, opts);
  }
};
