'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent, colors, opts) {
  return children.map(child => printInstance(child, print, indent, colors, opts)).join(opts.edgeSpacing);
}

function printProps(props, print, indent, colors, opts) {
  return Object.keys(props).sort().map(name => {
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

function printInstance(instance, print, indent, colors, opts) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(colors.content.open + instance + colors.content.close);
  }

  let result = colors.tag.open + '<' + instance.type + colors.tag.close;

  if (instance.props) {
    result += printProps(instance.props, print, indent, colors, opts);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent, colors, opts);
    result += colors.tag.open + '>' + colors.tag.close + opts.edgeSpacing + indent(children) + opts.edgeSpacing + colors.tag.open + '</' + instance.type + '>' + colors.tag.close;
  } else {
    result += colors.tag.open + ' />' + colors.tag.close;
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent, opts, colors) {
    return printInstance(val, print, indent, colors, opts);
  }
};
