var prettyFormat = require('../');

var React = require('react');
var ReactTestComponent = require('../plugins/ReactTestComponent');
var renderer = require('react/lib/ReactTestRenderer');

function returnArguments() {
  return arguments;
}

function assertPrintedJSX(actual, expected) {
  expect(
    prettyFormat(renderer.create(actual).toJSON(), {
      plugins: [ReactTestComponent]
    })
  ).toEqual(expected);
}

describe('prettyFormat()', () => {
  it('should print empty arguments', () => {
    var val = returnArguments();
    expect(prettyFormat(val)).toEqual('Arguments []');
  });

  it('should print arguments', () => {
    var val = returnArguments(1, 2, 3);
    expect(prettyFormat(val)).toEqual('Arguments [\n  1,\n  2,\n  3\n]');
  });

  it('should print an empty array', () => {
    var val = [];
    expect(prettyFormat(val)).toEqual('Array []');
  });

  it('should print an array with items', () => {
    var val = [1, 2, 3];
    expect(prettyFormat(val)).toEqual('Array [\n  1,\n  2,\n  3\n]');
  });

  it('should print a typed array', () => {
    var val = new Uint32Array(3);
    expect(prettyFormat(val)).toEqual('Uint32Array [\n  0,\n  0,\n  0\n]');
  });

  it('should print an array buffer', () => {
    var val = new ArrayBuffer(3);
    expect(prettyFormat(val)).toEqual('ArrayBuffer []');
  });

  it('should print a nested array', () => {
    var val = [[1, 2, 3]];
    expect(prettyFormat(val)).toEqual('Array [\n  Array [\n    1,\n    2,\n    3\n  ]\n]');
  });

  it('should print true', () => {
    var val = true;
    expect(prettyFormat(val)).toEqual('true');
  });

  it('should print false', () => {
    var val = false;
    expect(prettyFormat(val)).toEqual('false');
  });

  it('should print an error', () => {
    var val = new Error();
    expect(prettyFormat(val)).toEqual('[Error]');
  });

  it('should print a typed error with a message', () => {
    var val = new TypeError('message');
    expect(prettyFormat(val)).toEqual('[TypeError: message]');
  });

  it('should print a function constructor', () => {
    var val = new Function();
    expect(prettyFormat(val)).toEqual('[Function anonymous]');
  });

  it('should print an anonymous function', () => {
    var val = () => {};
    expect(prettyFormat(val)).toEqual('[Function anonymous]');
  });

  it('should print a named function', () => {
    var val = function named() {};
    expect(prettyFormat(val)).toEqual('[Function named]');
  });

  it('should print Infinity', () => {
    var val = Infinity;
    expect(prettyFormat(val)).toEqual('Infinity');
  });

  it('should print -Infinity', () => {
    var val = -Infinity;
    expect(prettyFormat(val)).toEqual('-Infinity');
  });

  it('should print an empty map', () => {
    var val = new Map();
    expect(prettyFormat(val)).toEqual('Map {}');
  });

  it('should print a map with values', () => {
    var val = new Map();
    val.set('prop1', 'value1');
    val.set('prop2', 'value2');
    expect(prettyFormat(val)).toEqual('Map {\n  "prop1" => "value1",\n  "prop2" => "value2"\n}');
  });

  it('should print a map with non-string keys', () => {
    var val = new Map();
    val.set({ prop: 'value' }, { prop: 'value' });
    expect(prettyFormat(val)).toEqual('Map {\n  Object {\n    "prop": "value"\n  } => Object {\n    "prop": "value"\n  }\n}');
  });

  it('should print NaN', () => {
    var val = NaN;
    expect(prettyFormat(val)).toEqual('NaN');
  });

  it('should print null', () => {
    var val = null;
    expect(prettyFormat(val)).toEqual('null');
  });

  it('should print a number', () => {
    var val = 123;
    expect(prettyFormat(val)).toEqual('123');
  });

  it('should print a date', () => {
    var val = new Date(10e11);
    expect(prettyFormat(val)).toEqual('2001-09-09T01:46:40.000Z');
  });

  it('should print an empty object', () => {
    var val = {};
    expect(prettyFormat(val)).toEqual('Object {}');
  });

  it('should print an object with properties', () => {
    var val = { prop1: 'value1', prop2: 'value2' };
    expect(prettyFormat(val), 'Object {\n  "prop1": "value1",\n  "prop2": "value2"\n}');
  });

  it('should print an object with properties and symbols', () => {
    var val = { prop: 'value1' };
    val[Symbol('symbol1')] = 'value2';
    val[Symbol('symbol2')] = 'value3';
    expect(prettyFormat(val), 'Object {\n  "prop": "value1",\n  Symbol(symbol1): "value2",\n  Symbol(symbol2): "value3"\n}');
  });

  it('should print an object with sorted properties', () => {
    var val = { b: 1, a: 2 };
    expect(prettyFormat(val), 'Object {\n  "a": 2,\n  "b": 1\n}');
  });

  it('should print regular expressions from constructors', () => {
    var val = new RegExp('regexp');
    expect(prettyFormat(val), '/regexp/');
  });

  it('should print regular expressions from literals', () => {
    var val = /regexp/ig;
    expect(prettyFormat(val), '/regexp/gi');
  });

  it('should print an empty set', () => {
    var val = new Set();
    expect(prettyFormat(val), 'Set {}');
  });

  it('should print a set with values', () => {
    var val = new Set();
    val.add('value1');
    val.add('value2');
    expect(prettyFormat(val), 'Set {\n  "value1",\n  "value2"\n}');
  });

  it('should print a string', () => {
    var val = 'string';
    expect(prettyFormat(val), '"string"');
  });

  it('should print a string with escapes', () => {
    expect(prettyFormat('\"-\"'), '"\\"-\\""');
    expect(prettyFormat('\\ \\\\'), '"\\\\ \\\\\\\\"');
  });

  it('should print a symbol', () => {
    var val = Symbol('symbol');
    expect(prettyFormat(val), 'Symbol(symbol)');
  });

  it('should print undefined', () => {
    var val = undefined;
    expect(prettyFormat(val), 'undefined');
  });

  it('should print a WeakMap', () => {
    var val = new WeakMap();
    expect(prettyFormat(val), 'WeakMap {}');
  });

  it('should print a WeakSet', () => {
    var val = new WeakSet();
    expect(prettyFormat(val), 'WeakSet {}');
  });

  it('should print deeply nested objects', () => {
    var val = { prop: { prop: { prop: 'value' } } };
    expect(prettyFormat(val), 'Object {\n  "prop": Object {\n    "prop": Object {\n      "prop": "value"\n    }\n  }\n}');
  });

  it('should print circular references', () => {
    var val = {};
    val.prop = val;
    expect(prettyFormat(val), 'Object {\n  "prop": [Circular]\n}')
  });

  it('should print parallel references', () => {
    var inner = {};
    var val = { prop1: inner, prop2: inner };
    expect(prettyFormat(val), 'Object {\n  "prop1": Object {},\n  "prop2": Object {}\n}')
  });

  it('should be able to customize indent', () => {
    var val = { prop: 'value' };
    expect(prettyFormat(val, { indent: 4 }), 'Object {\n    "prop": "value"\n}');
  });

  it('should be able to customize the max depth', () => {
    var val = { prop: { prop: { prop: {} } } };
    expect(prettyFormat(val, { maxDepth: 2 }), 'Object {\n  "prop": Object {\n    "prop": [Object]\n  }\n}');
  });

  it('should throw on invalid options', () => {
    expect(() => {
      prettyFormat({}, { invalidOption: true });
    }).toThrow();
  });

  it('should support plugins', () => {
    function Foo() {};

    expect(prettyFormat(new Foo(), {
      plugins: [{
        test: function(object) {
          return object.constructor.name === 'Foo';
        },
        print: () => {
          return 'class Foo'
        }
      }]
    }), 'class Foo');
  });

  it('should print objects with no constructor', () => {
    expect(prettyFormat(Object.create(null)), 'Object {}');
  });

  describe('ReactTestComponent plugin', () => {
    var Mouse = React.createClass({
      getInitialState: () => {
        return { mouse: 'mouse' };
      },
      handleMoose: () => {
        this.setState({ mouse: 'moose' });
      },
      render: () => {
        return React.createElement('div', null, this.state.mouse);
      }
    });

    it('should support a single element with no props or children', () => {
      assertPrintedJSX(
        React.createElement('Mouse'),
        '<Mouse />'
      );
    });

    it('should support a single element with no props or children', () => {
      assertPrintedJSX(
        React.createElement('Mouse', null, 'Hello World'),
        '<Mouse>\n  Hello World\n</Mouse>'
      );
    });

    it('should support props with strings', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { style: 'color:red' }),
        '<Mouse\n  style="color:red" />'
      );
    });

    it('should support a single element with a function prop', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { onclick: function onclick(){} }),
        '<Mouse\n  onclick={[Function onclick]} />'
      );
    });

    it('should support a single element with a object prop', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { customProp: { one: '1', two: 2 } }),
        '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  } />'
      );
    });

    it('should support an element with and object prop and children', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { customProp: { one: '1', two: 2 } },
          React.createElement('Mouse')
        ),
        '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }>\n  <Mouse />\n</Mouse>'
      );
    });

    it('should support an element with complex props and mixed children', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { customProp: { one: '1', two: 2 }, onclick: () => {} },
          'HELLO',
          React.createElement('Mouse'), 'CIAO'
        ),
        '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={[Function anonymous]}>\n  HELLO\n  <Mouse />\n  CIAO\n</Mouse>'
      );
    });

    it('should support everything all together', () => {
      assertPrintedJSX(
        React.createElement('Mouse', { customProp: { one: '1', two: 2 }, onclick: () => {} },
          'HELLO',
          React.createElement('Mouse', { customProp: { one: '1', two: 2 }, onclick: () => {} },
            'HELLO',
            React.createElement('Mouse'),
            'CIAO'
          ),
          'CIAO'
        ),
        '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={[Function anonymous]}>\n  HELLO\n  <Mouse\n    customProp={\n      Object {\n        "one": "1",\n        "two": 2\n      }\n    }\n    onclick={[Function anonymous]}>\n    HELLO\n    <Mouse />\n    CIAO\n  </Mouse>\n  CIAO\n</Mouse>'
      );
    });

    it('should sort props in nested components', () => {
      assertPrintedJSX(
        React.createElement('Mouse', {
            zeus: 'kentaromiura watched me fix this',
            abc: {
              one: '1',
              two: 2
            }
          },
          React.createElement('Mouse', {
              xyz: 123,
              acbd: {
                one: '1',
                two: 2
              }
            },
            'NESTED'
          )
        ),
        '<Mouse\n  abc={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  zeus="kentaromiura watched me fix this">\n  <Mouse\n    acbd={\n      Object {\n        "one": "1",\n        "two": 2\n      }\n    }\n    xyz={123}>\n    NESTED\n  </Mouse>\n</Mouse>'
      );
    });
  });
});
