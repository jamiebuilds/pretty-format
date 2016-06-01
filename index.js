var _ = require('lodash');

var STATE = {};

var NEWLINE_REGEXP = /\n/ig;

var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function indentLines(str) {
  return '  ' + str.replace(NEWLINE_REGEXP, '\n  ');
}

function getSymbols(obj) {
  if (typeof Object.getOwnPropertySymbols === 'function') {
    return Object.getOwnPropertySymbols(obj);
  } else {
    return [];
  }
}

/**
 * @public
 * @class Type
 */
function Type(options) {
  this.test = options.test;
  this.print = options.print;
}

function reset() {
  STATE.visitedRefs = [];
  STATE.prevVisitedRefs = null;
  STATE.depth = 0;
}

reset();

function prettyFormat(val) {
  if (STATE.depth === 0) {
    reset();
  }

  STATE.prevVisitedRefs = STATE.visitedRefs;
  STATE.visitedRefs = [].concat(STATE.visitedRefs);
  STATE.depth++;

  var result, error;
  try {
    result = _.find(Type.all, function(type) {
      return type.test(val);
    }).print(val);
  } catch(e) {
    error = e;
  }

  STATE.depth--;
  STATE.visitedRefs = STATE.prevVisitedRefs;

  if (STATE.depth === 0) {
    reset();
  }

  if (error) {
    throw error;
  } else {
    return result;
  }
}

prettyFormat.Type = Type;
prettyFormat.reset = reset;

module.exports = prettyFormat;

function printArray(array) {
  var body = '';

  if (array.length) {
    body += '\n';

    for (var i = 0; i < array.length; i++) {
      body += indentLines(prettyFormat(array[i]));

      if (i < array.length - 1) {
        body += ',\n';
      }
    }

    body += '\n';
  }

  return '[' + body + ']';
}

/**
 * @public
 * @class Arguments
 * @extends Type
 * @memberOf Type
 */
Type.Arguments = new Type({
  test: _.isArguments,

  print: function(val) {
    return 'Arguments ' + printArray(val);
  }
});

/**
 * @public
 * @class Array
 * @extends Type
 * @memberOf Type
 */
Type.Array = new Type({
  test: function(val) {
    return _.isArray(val) || _.isTypedArray(val) || _.isArrayBuffer(val);
  },

  print: function(val) {
    return val.constructor.name + ' ' + printArray(val);
  }
});

/**
 * @public
 * @class Boolean
 * @extends Type
 * @memberOf Type
 */
Type.Boolean = new Type({
  test: _.isBoolean,

  print: function(val) {
    return Boolean.prototype.toString.call(val);
  }
});

/**
 * @public
 * @class Circular
 * @extends Type
 * @memberOf Type
 */
Type.Circular = new Type({
  test: function(val) {
    if (_.isObject(val)) {
      if (_.indexOf(STATE.visitedRefs, val) !== -1) {
        return true;
      }
      STATE.visitedRefs.push(val);
    }
    return false;
  },

  print: function() {
    return '[Circular]';
  }
});

/**
 * @public
 * @class Date
 * @extends Type
 * @memberOf Type
 */
Type.Date = new Type({
  test: _.isDate,

  print: function(val) {
    return Date.prototype.toISOString.call(val);
  }
});

/**
 * @public
 * @class Error
 * @extends Type
 * @memberOf Type
 */
Type.Error = new Type({
  test: _.isError,

  print: function(val) {
    return '[' + Error.prototype.toString.call(val) + ']';
  }
});

/**
 * @public
 * @class Function
 * @extends Type
 * @memberOf Type
 */
Type.Function = new Type({
  test: _.isFunction,

  print: function(val) {
    return Function.prototype.toString.call(val);
  }
});

/**
 * @public
 * @class Infinity
 * @extends Type
 * @memberOf Type
 */
Type.Infinity = new Type({
  test: function(val) {
    return val === Infinity || val === -Infinity;
  },

  print: function(val) {
    return Infinity.toString.call(val);
  }
});

/**
 * @public
 * @class Map
 * @extends Type
 * @memberOf Type
 */
Type.Map = new Type({
  test: _.isMap,

  print: function(val) {
    var result = 'Map {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += '\n';

      while (!current.done) {
        var key = prettyFormat(current.value[0]);
        var value = prettyFormat(current.value[1]);

        result += indentLines(key + ' => ' + value);

        current = iterator.next();

        if (!current.done) {
          result += ',\n';
        }
      }

      result += '\n';
    }

    return result + '}';
  }
});

/**
 * @public
 * @class NaN
 * @extends Type
 * @memberOf Type
 */
Type.NaN = new Type({
  test: _.isNaN,

  print: function() {
    return 'NaN';
  }
});

/**
 * @public
 * @class Null
 * @extends Type
 * @memberOf Type
 */
Type.Null = new Type({
  test: _.isNull,

  print: function() {
    return 'null';
  }
});

/**
 * @public
 * @class Number
 * @extends Type
 * @memberOf Type
 */
Type.Number = new Type({
  test: _.isFinite,

  print: function(val) {
    return val === 0 && (1 / val) < 0 ? '-0' : '' + val;
  }
});

/**
 * @public
 * @class Object
 * @extends Type
 * @memberOf Type
 */
Type.Object = new Type({
  test: _.isObject,

  print: function(val) {
    var result = val.constructor.name + ' {',
        keys = _.keys(val),
        symbols = getSymbols(val);

    if (symbols.length) {
      keys = _.reject(keys, _.bindKey(SYMBOL_REGEXP, 'test')).concat(symbols);
    }

    if (keys.length) {
      result += '\n';

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var name = prettyFormat(key);
        var value = prettyFormat(val[key]);

        result += indentLines(name + ': ' + value);

        if (i < keys.length - 1) {
          result += ',\n';
        }
      }

      result += '\n';
    }

    return result + '}';
  }
});

/**
 * @public
 * @class RegExp
 * @extends Type
 * @memberOf Type
 */
Type.RegExp = new Type({
  test: _.isRegExp,

  print: function(val) {
    return RegExp.prototype.toString.call(val);
  }
});

/**
 * @public
 * @class Set
 * @extends Type
 * @memberOf Type
 */
Type.Set = new Type({
  test: _.isSet,

  print: function(val) {
    var result = 'Set {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += '\n';

      while (!current.done) {
        var value = prettyFormat(current.value[1]);

        result += indentLines(value);

        current = iterator.next();

        if (!current.done) {
          result += ',\n';
        }
      }

      result += '\n';
    }

    return result + '}';
  }
});

/**
 * @public
 * @class String
 * @extends Type
 * @memberOf Type
 */
Type.String = new Type({
  test: _.isString,

  print: function(val) {
    return '"' + val + '"';
  }
});

/**
 * @public
 * @class Symbol
 * @extends Type
 * @memberOf Type
 */
Type.Symbol = new Type({
  test: _.isSymbol,

  print: function(val) {
    return Symbol.prototype.toString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  }
});

/**
 * @public
 * @class Undefined
 * @extends Type
 * @memberOf Type
 */
Type.Undefined = new Type({
  test: _.isUndefined,

  print: function() {
    return 'undefined';
  }
});

Type.WeakMap = new Type({
  test: _.isWeakMap,

  print: function() {
    return 'WeakMap {}';
  }
});

Type.WeakMap = new Type({
  test: _.isWeakMap,

  print: function() {
    return 'WeakMap {}';
  }
});

Type.WeakSet = new Type({
  test: _.isWeakSet,

  print: function() {
    return 'WeakSet {}';
  }
});

Type.all = [
  Type.Circular,

  Type.Arguments,
  Type.Array,
  Type.Boolean,
  Type.Date,
  Type.Error,
  Type.Function,
  Type.Infinity,
  Type.Map,
  Type.NaN,
  Type.Null,
  Type.Number,
  Type.RegExp,
  Type.Set,
  Type.String,
  Type.Symbol,
  Type.Undefined,
  Type.WeakMap,
  Type.WeakSet,

  Type.Object
];
