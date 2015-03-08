import _ from 'lodash';

const STATE = {};

const NEWLINE_REGEXP = /\n/ig;

function indentLines(str) {
  return '  ' + str.replace(NEWLINE_REGEXP, '\n  ');
}

/**
 * @public
 * @class Type
 */
function Type(options) {
  this.test = options.test;
  this.print = options.print;
}

/**
 * @public
 * @class Array
 * @extends Type
 * @memberOf Type
 */
Type.Array = new Type({
  test: _.isArray,

  print(val) {
    var result = '[';

    if (val.length) {
      result += '\n';

      for (var i = 0; i < val.length; i++) {
        result += indentLines(print(val[i]));

        if (i < val.length - 1) {
          result += ',\n';
        }
      }

      result += '\n';
    }

    return result + ']';
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

  print(val) {
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
  test(val) {
    if (_.isObject(val)) {
      if (_.indexOf(STATE.visitedRefs, val) !== -1) {
        return true;
      }
      STATE.visitedRefs.push(val);
    }
    return false;
  },

  print() {
    return '[Circular]';
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

  print(val) {
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

  print(val) {
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
  test(val) {
    return val === Infinity || val === -Infinity;
  },

  print(val) {
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
  test(val) {
    return Object.prototype.toString.call(val) === '[object Map]';
  },

  print(val) {
    var result = 'Map {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += '\n';

      while (!current.done) {
        var key = print(current.value[0]);
        var value = print(current.value[1]);

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

  print() {
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

  print() {
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

  print(val) {
    return Number.prototype.toString.call(val);
  }
});

/**
 * @public
 * @class Object
 * @extends Type
 * @memberOf Type
 */
Type.Object = new Type({
  test: _.isPlainObject,

  print(val) {
    var result = 'Object {',
        keys = _.keys(val);

    keys = keys.concat(Object.getOwnPropertySymbols(val));

    if (keys.length) {
      result += '\n';

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var name = print(key);
        var value = print(val[key]);

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

  print(val) {
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
  test(val) {
    return Object.prototype.toString.call(val) === '[object Set]';
  },

  print(val) {
    var result = 'Set {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += '\n';

      while (!current.done) {
        var value = print(current.value[1]);

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

  print(val) {
    return '"' + val + '"';
  }
});

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

/**
 * @public
 * @class Symbol
 * @extends Type
 * @memberOf Type
 */
Type.Symbol = new Type({
  test(val) {
    return val && val.toString && SYMBOL_REGEXP.test(val.toString());
  },

  print(val) {
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

  print() {
    return 'undefined';
  }
});

Type.all = [
  Type.Circular,

  Type.Array,
  Type.Boolean,
  Type.Error,
  Type.Function,
  Type.Infinity,
  Type.Map,
  Type.NaN,
  Type.Null,
  Type.Number,
  Type.Object,
  Type.RegExp,
  Type.Set,
  Type.String,
  Type.Symbol,
  Type.Undefined
];

function reset() {
  STATE.visitedRefs = [];
  STATE.prevVisitedRefs = null;
  STATE.depth = 0;
}

reset();

export default function print(val) {
  if (STATE.depth === 0) {
    reset();
  }

  STATE.prevVisitedRefs = STATE.visitedRefs;
  STATE.visitedRefs = [].concat(STATE.visitedRefs);
  STATE.depth++;

  var result, error;
  try {
    result = _.find(Type.all, type => type.test(val)).print(val);
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

print.Type = Type;
print.reset = reset;
