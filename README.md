# pretty-format [![Travis build status](http://img.shields.io/travis/thejameskyle/pretty-format.svg?style=flat)](https://travis-ci.org/thejameskyle/pretty-format)

Stringify any JavaScript value.

![](http://i.imgur.com/UM7RQza.png)

## Installation

```sh
$ npm install pretty-format
```

## Usage

```js
var prettyFormat = require('pretty-format');

var obj = { foo: 1 };
obj.self = obj;
obj[Symbol('foo')] = 'foo';
obj.bar = new Map();
obj.bar.set('baz', 'bat');

console.log(prettyFormat(obj));
// Object {
//   "foo": 1,
//   "self": [Circular],
//   "bar": Map {
//     "baz" => "bat"
//   },
//   Symbol(foo): "foo"
// }
```
