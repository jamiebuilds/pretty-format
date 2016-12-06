'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent, output, opts) {
  return children.map(child => printInstance(child, print, indent, output, opts)).join(opts.edgeSpacing);
}

function printProps(props, print, indent, output, opts) {
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

    return opts.spacing + indent(output.prop(name) + '=') + output.value(printed);
  }).join('');
}

function printInstance(instance, print, indent, output, opts) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(output.content(instance));
  }

  let result = output.tag('<' + instance.type);

  if (instance.props) {
    result += printProps(instance.props, print, indent, output, opts);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent, output, opts);
    result += output.tag('>') + opts.edgeSpacing + indent(children) + opts.edgeSpacing + output.tag('</' + instance.type + '>');
  } else {
    result += output.tag(' />');
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent, output, opts) {
    return printInstance(val, print, indent, output, opts);
  }
};
