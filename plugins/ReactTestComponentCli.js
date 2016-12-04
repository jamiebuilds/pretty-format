'use strict';

const chalk = require('chalk');
const printString = require('../printString');

const theme = {
	tag: 'cyan',
	content: 'white',
	prop: 'yellow',
	value: 'green'
};

const reactTestInstance = Symbol.for('react.test.json');

function colorize(value, type) {
	return chalk[theme[type]](value);
}

function printChildren(children, print, indent, opts) {
  return children.map(child => printInstance(child, print, indent, opts)).join(opts.edgeSpacing);
}

function printProps(props, print, indent, opts) {
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

    return opts.spacing + indent(colorize(name, 'prop') + '=') + colorize(printed, 'value');
  }).join('');
}

function printInstance(instance, print, indent, opts) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(colorize(instance, 'content'));
  }

  let result = colorize('<' + instance.type, 'tag');

  if (instance.props) {
    result += printProps(instance.props, print, indent, opts);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent, opts);
    result += colorize('>', 'tag') + opts.edgeSpacing + indent(children) + opts.edgeSpacing + colorize('</' + instance.type + '>', 'tag');
  } else {
    result += colorize(' />', 'tag');
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent, opts) {
    return printInstance(val, print, indent, opts);
  }
};
