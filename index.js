var isArguments    = require('lodash/isArguments');
var isArray        = require('lodash/isArray');
var isArrayBuffer  = require('lodash/isArrayBuffer');
var isBoolean      = require('lodash/isBoolean');
var isDate         = require('lodash/isDate');
var isError        = require('lodash/isError');
var isFinite       = require('lodash/isFinite');
var isFunction     = require('lodash/isFunction');
var isMap          = require('lodash/isMap');
var isNaN          = require('lodash/isNaN');
var isNull         = require('lodash/isNull');
var isObject       = require('lodash/isObject');
var isRegExp       = require('lodash/isRegExp');
var isSet          = require('lodash/isSet');
var isString       = require('lodash/isString');
var isSymbol       = require('lodash/isSymbol');
var isTypedArray   = require('lodash/isTypedArray');
var isUndefined    = require('lodash/isUndefined');
var isWeakMap      = require('lodash/isWeakMap');
var isWeakSet      = require('lodash/isWeakSet');

var NEWLINE_REGEXP = /\n/ig;
var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function isArrayish(val) {
  return isArray(val) || isTypedArray(val) || isArrayBuffer(val);
}

function isNumber(val) {
  return isFinite(val);
}

function isInfinity(val) {
  return val === Infinity || val === -Infinity;
}

function isNegativeZero(val) {
  return val === 0 && (1 / val) < 0;
}

function getSymbols(obj) {
  if (typeof Object.getOwnPropertySymbols === 'function') {
    return Object.getOwnPropertySymbols(obj);
  } else {
    return [];
  }
}

function indent(str, opts) {
  var indentation = new Array(opts.indent + 1).join(' ');
  return indentation + str.replace(NEWLINE_REGEXP, '\n' + indentation);
}

function printList(list, refs, opts, state) {
  var body = '';

  if (list.length) {
    body += '\n';

    for (var i = 0; i < list.length; i++) {
      body += indent(print(list[i], refs, opts, state), opts);

      if (i < list.length - 1) {
        body += ',\n';
      }
    }

    body += '\n';
  }

  return '[' + body + ']';
}

function printArray(val, refs, opts, state) {
  return val.constructor.name + ' ' + printList(val, refs, opts, state);
}

function printArguments(val, refs, opts, state) {
  return 'Arguments ' + printList(val, refs, opts, state);
}

function printMap(val, refs, opts, state) {
  var result = 'Map {';
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += '\n';

    while (!current.done) {
      var key = print(current.value[0], refs, opts, state);
      var value = print(current.value[1], refs, opts, state);

      result += indent(key + ' => ' + value, opts);

      current = iterator.next();

      if (!current.done) {
        result += ',\n';
      }
    }

    result += '\n';
  }

  return result + '}';
}

function printObject(val, refs, opts, state) {
  var result = val.constructor.name + ' {';
  var keys = Object.keys(val);
  var symbols = getSymbols(val);

  if (symbols.length) {
    keys = keys.filter(function(key) {
      return !isSymbol(key);
    }).concat(symbols);
  }

  if (keys.length) {
    result += '\n';

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var name = print(key, refs, opts, state);
      var value = print(val[key], refs, opts, state);

      result += indent(name + ': ' + value, opts);

      if (i < keys.length - 1) {
        result += ',\n';
      }
    }

    result += '\n';
  }

  return result + '}';
}

function printSet(val, refs, opts, state) {
  var result = 'Set {';
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += '\n';

    while (!current.done) {
      var value = print(current.value[1], refs, opts, state);

      result += indent(value, opts);

      current = iterator.next();

      if (!current.done) {
        result += ',\n';
      }
    }

    result += '\n';
  }

  return result + '}';
}

function printWithPlugin(plugin, val, refs, opts, state) {
  function boundPrint(val) {
    return print(val, refs, opts, state);
  }

  function boundIndent(val, options) {
    options = options || opts;
    return indent(val, options);
  }

  return plugin.print(val, boundPrint, boundIndent);
}

function printValue(val, refs, opts, state) {
  var plugins = opts.plugins;

  for (var p = 0; p < plugins.length; p++) {
    var plugin = plugins[p];

    if (plugin.test(val)) {
      return printWithPlugin(plugin, val, refs, opts, state);
    }
  }

  // Simple values
  if ( isBoolean   (val) ) return Boolean.prototype.toString.call(val);
  if ( isDate      (val) ) return Date.prototype.toISOString.call(val);
  if ( isError     (val) ) return '[' + Error.prototype.toString.call(val) + ']';
  if ( isFunction  (val) ) return Function.prototype.toString.call(val);
  if ( isInfinity  (val) ) return Infinity.toString.call(val);
  if ( isNaN       (val) ) return 'NaN';
  if ( isNull      (val) ) return 'null';
  if ( isNumber    (val) ) return isNegativeZero(val) ? '-0' : '' + val;
  if ( isRegExp    (val) ) return RegExp.prototype.toString.call(val)
  if ( isString    (val) ) return '"' + val + '"';
  if ( isSymbol    (val) ) return Symbol.prototype.toString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  if ( isUndefined (val) ) return 'undefined';
  if ( isWeakMap   (val) ) return 'WeakMap {}';
  if ( isWeakSet   (val) ) return 'WeakSet {}';

  var stop = opts.maxDepth < state.depth;

  if ( isArguments (val) ) return stop ? '[Arguments]' : printArguments (val, refs, opts, state);
  if ( isArrayish  (val) ) return stop ? '[Array]'     : printArray     (val, refs, opts, state);
  if ( isMap       (val) ) return stop ? '[Map]'       : printMap       (val, refs, opts, state);
  if ( isSet       (val) ) return stop ? '[Set]'       : printSet       (val, refs, opts, state);
  // purposefully last:
  if ( isObject    (val) ) return stop ? '[Object]'    : printObject    (val, refs, opts, state);
}

function print(val, refs, opts, state) {
  refs = refs.slice(); // clone

  if (refs.indexOf(val) !== -1) {
    return '[Circular]';
  } else {
    refs.push(val);
  }

  state.depth++;
  var result = printValue(val, refs, opts, state);
  state.depth--;
  return result;
}

var DEFAULTS = {
  indent: 2,
  maxDepth: Infinity,
  plugins: []
};

function validateOptions(opts) {
  Object.keys(opts).forEach(function(key) {
    if (!DEFAULTS.hasOwnProperty(key)) {
      throw new Error('prettyFormat: Invalid option: ' + key);
    }
  });
}

function normalizeOptions(opts) {
  var result = {};

  Object.keys(DEFAULTS).forEach(function(key) {
    result[key] = opts.hasOwnProperty(key) ? opts[key] : DEFAULTS[key];
  });

  return result;
}

module.exports = function prettyFormat(val, opts) {
  opts = opts || {};
  validateOptions(opts)
  opts = normalizeOptions(opts)
  plugins = opts.plugins;

  return print(val, [], opts, {
    depth: 0
  });
};
