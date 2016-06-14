# pretty-format [![Travis build status](http://img.shields.io/travis/thejameskyle/pretty-format.svg?style=flat)](https://travis-ci.org/thejameskyle/pretty-format)

> Stringify any JavaScript value.

Supports objects, arrays (and typed arrays and array buffers), arguments,
booleans, dates, errors, functions, `Infinity`, maps, `NaN`, `null`, numbers,
regular expressions, sets, strings, symbols, `undefined`, weak maps, weak
sets, and circular data structures.

## Installation

```sh
$ npm install pretty-format
```

## Usage

```js
var prettyFormat = require('pretty-format');

var obj = { property: {} };
obj.circularReference = obj;
obj[Symbol('foo')] = 'foo';
obj.map = new Map();
obj.map.set('prop', 'value');
obj.array = [1, NaN, Infinity];

console.log(prettyFormat(obj));
```

**Result:**

```js
Object {
  "property": Object {},
  "circularReference": [Circular],
  "map": Map {
    "prop" => "value"
  },
  "array": Array [
    1,
    NaN,
    Infinity
  ],
  Symbol(foo): "foo"
}
```

### Plugins

Pretty format also supports adding plugins:

```js
var fooPlugin = {
  test: function(val) {
    return val && val.hasOwnProperty('foo');
  },
  print: function(val, print, indent) {
    return 'Foo: ' + print(val.foo);
  }
};

var obj = { foo: { bar: {} } };

prettyFormat(obj, {
  plugins: [fooPlugin]
});
// Foo: Object {
//   "bar": Object {}
// }
```
