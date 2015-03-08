# pretty-format
[![Travis build status](http://img.shields.io/travis/thejameskyle/pretty-format.svg?style=flat)](https://travis-ci.org/thejameskyle/pretty-format)
[![Code Climate](https://codeclimate.com/github/thejameskyle/pretty-format/badges/gpa.svg)](https://codeclimate.com/github/thejameskyle/pretty-format)
[![Test Coverage](https://codeclimate.com/github/thejameskyle/pretty-format/badges/coverage.svg)](https://codeclimate.com/github/thejameskyle/pretty-format)
[![Dependency Status](https://david-dm.org/thejameskyle/pretty-format.svg)](https://david-dm.org/thejameskyle/pretty-format)
[![devDependency Status](https://david-dm.org/thejameskyle/pretty-format/dev-status.svg)](https://david-dm.org/thejameskyle/pretty-format#info=devDependencies)

Stringify any JavaScript value.

![](http://i.imgur.com/UM7RQza.png)


### Example

```js
import prettyFormat from 'pretty-format';

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
