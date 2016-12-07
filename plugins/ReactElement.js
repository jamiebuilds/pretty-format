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

function printChildren(flatChildren, print, indent, colors, opts) {
  return flatChildren.map(node => {
    if (typeof node === 'object') {
      return printElement(node, print, indent, colors, opts);
    } else if (typeof node === 'string') {
      return printString(colors.content.open + node + colors.content.close);
    } else {
      return print(node);
    }
  }).join(opts.edgeSpacing);
}

function printProps(props, print, indent, colors, opts) {
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

    return opts.spacing + indent(colors.prop.open + name + colors.prop.close + '=') + colors.value.open + printed + colors.value.close;
  }).join('');
}

function printElement(element, print, indent, colors, opts) {
  let result = colors.tag.open + '<';
  let elementName;
  if (typeof element.type === 'string') {
    elementName = element.type;
  } else if (typeof element.type === 'function') {
    elementName = element.type.displayName || element.type.name || 'Unknown';
  } else {
    elementName = 'Unknown';
  }
  result += elementName + colors.tag.close;
  result += printProps(element.props, print, indent, colors, opts);

  const opaqueChildren = element.props.children;
  if (opaqueChildren) {
    let flatChildren = [];
    traverseChildren(opaqueChildren, child => {
      flatChildren.push(child);
    });
    const children = printChildren(flatChildren, print, indent, colors, opts);
    result += colors.tag.open + '>' + colors.tag.close + opts.edgeSpacing + indent(children) + opts.edgeSpacing + colors.tag.open + '</' + elementName + '>' + colors.tag.close;
  } else {
    result += colors.tag.open + ' />' + colors.tag.close;
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactElement;
  },
  print(val, print, indent, opts, colors) {
    return printElement(val, print, indent, colors, opts);
  }
};
