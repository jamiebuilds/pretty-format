import _ from 'lodash';
import {format} from 'util';
import {Type} from '../../src/pretty-format';
import print from '../../src/pretty-format';

function typeTests(name, Type, config) {
  describe(name, function() {
    describe('#test', function() {
      _.each(config.test, test => {
        it('should ' + (test.pass ? '' : 'not ') + 'pass for ' + format(test.value), function() {
          expect(Type.test(test.value)).to.be[test.pass];
        });
      });
    });

    describe('#print', function() {
      _.each(config.print, test => {
        it('should print ' + test.output + ' correctly', function() {
          expect(print(test.input)).to.equal(test.output);
        });

        if (test.both !== false) {
          it('should print ' + test.output + ' correctly from the type itself', function() {
            expect(Type.print(test.input)).to.equal(test.output);
          });
        }
      });
    });
  });
}

describe('Type', function() {
  describe('#constructor', function() {
    beforeEach(function() {
      this.testFn = function() {};
      this.print = function() {};
      this.type = new Type({
        test: this.testFn,
        print: this.print
      });
    });

    it('should add the test and print methods to the instance', function() {
      expect(this.type).to.have.property('test', this.testFn);
      expect(this.type).to.have.property('print', this.print);
    });
  });

  (function() {
    typeTests('Array', Type.Array, {
      test: [
        { value: [], pass: true },
        { value: {}, pass: false },
        { value: 'foo', pass: false }
      ],
      print: [
        { input: [], output: '[]' },
        { input: [1], output: '[\n  1\n]' },
        { input: [[1, 2]], output: '[\n  [\n    1,\n    2\n  ]\n]' }
      ]
    });
  }());

  (function() {
    typeTests('Boolean', Type.Boolean, {
      test: [
        { value: true, pass: true },
        { value: false, pass: true },
        { value: null, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: true, output: 'true' },
        { input: false, output: 'false' }
      ]
    });
  }());

  (function() {
    var obj = {};
    var arr = [];

    obj.obj = obj;
    arr[0] = arr;

    typeTests('Circular', Type.Circular, {
      test: [
        { value: obj, pass: false },
        { value: obj, pass: true },
        { value: arr, pass: false },
        { value: arr, pass: true },
        { value: { obj: {} }, pass: false },
        { value: { a: 1, b: 1 }, pass: false }
      ],
      print: [
        { input: obj, output: 'Object {\n  "obj": [Circular]\n}', both: false },
        { input: arr, output: '[\n  [Circular]\n]', both: false }
      ]
    });
  }());

  (function() {
    typeTests('Error', Type.Error, {
      test: [
        { value: new Error(), pass: true },
        { value: new TypeError('bar'), pass: true },
        { value: false, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: new Error(), output: '[Error]' },
        { input: new TypeError('bar'), output: '[TypeError: bar]' }
      ]
    });
  }());

  (function() {
    typeTests('Function', Type.Function, {
      test: [
        { value: new Function(), pass: true },
        { value: function() {}, pass: true },
        { value: false, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: new Function(), output: 'function anonymous() {\n\n}' },
        { input: function() {}, output: 'function input() {}' }
      ]
    });
  }());

  (function() {
    typeTests('Infinity', Type.Infinity, {
      test: [
        { value: Infinity, pass: true },
        { value: -Infinity, pass: true },
        { value: 2, pass: false },
        { value: NaN, pass: false }
      ],
      print: [
        { input: Infinity, output: 'Infinity' },
        { input: -Infinity, output: '-Infinity' }
      ]
    });
  }());

  (function() {
    var map1 = new Map();
    var map2 = new Map();
    map2.set('foo', 'bar');
    map2.set('bar', 'baz');

    typeTests('Map', Type.Map, {
      test: [
        { value: map1, pass: true },
        { value: map2, pass: true },
        { value: false, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: map1, output: 'Map {}' },
        { input: map2, output: 'Map {\n  "foo" => "bar",\n  "bar" => "baz"\n}' }
      ]
    });
  }());

  (function() {
    typeTests('NaN', Type.NaN, {
      test: [
        { value: NaN, pass: true },
        { value: 2, pass: false },
        { value: false, pass: false }
      ],
      print: [
        { input: NaN, output: 'NaN' }
      ]
    });
  }());

  (function() {
    typeTests('Null', Type.Null, {
      test: [
        { value: null, pass: true },
        { value: undefined, pass: false },
        { value: false, pass: false }
      ],
      print: [
        { input: null, output: 'null' }
      ]
    });
  }());

  (function() {
    typeTests('Number', Type.Number, {
      test: [
        { value: 2, pass: true },
        { value: NaN, pass: false },
        { value: false, pass: false }
      ],
      print: [
        { input: 2, output: '2' },
        { input: 0, output: '0' },
        { input: -0, output: '-0' },
        { input: Infinity, output: 'Infinity' },
        { input: -Infinity, output: '-Infinity' }
      ]
    });
  }());

  (function() {
    typeTests('Date', Type.Date, {
      test: [
        { value: new Date(10e11), pass: true },
        { value: NaN, pass: false },
        { value: false, pass: false }
      ],
      print: [
        { input: new Date(10e11), output: '2001-09-09T01:46:40.000Z' },
        { input: new Date(new Date(20e11)), output: '2033-05-18T03:33:20.000Z' }
      ]
    });
  }());

  (function() {
    typeTests('Object', Type.Object, {
      test: [
        { value: {}, pass: true },
        { value: new Map(), pass: false },
        { value: [], pass: false }
      ],
      print: [
        { input: {}, output: 'Object {}' },
        { input: { foo: 'bar', bar: 'baz' }, output: 'Object {\n  "foo": "bar",\n  "bar": "baz"\n}' },
        { input: { foo: { bar: 'baz' } }, output: 'Object {\n  "foo": Object {\n    "bar": "baz"\n  }\n}' },
        { input: { [Symbol('foo')]: 'foo' }, output: 'Object {\n  Symbol(foo): "foo"\n}' }
      ]
    });
  }());

  (function() {
    typeTests('RegExp', Type.RegExp, {
      test: [
        { value: new RegExp('foo'), pass: true },
        { value: /bar/ig, pass: true },
        { value: {}, pass: false }
      ],
      print: [
        { input: new RegExp('foo'), output: '/foo/' },
        { input: /bar/ig, output: '/bar/gi' }
      ]
    });
  }());

  (function() {
    var set1 = new Set();
    var set2 = new Set();
    set2.add('foo');
    set2.add('bar');

    typeTests('Set', Type.Set, {
      test: [
        { value: set1, pass: true },
        { value: set2, pass: true },
        { value: false, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: set1, output: 'Set {}' },
        { input: set2, output: 'Set {\n  "foo",\n  "bar"\n}' }
      ]
    });
  }());

  (function() {
    typeTests('String', Type.String, {
      test: [
        { value: String('foo'), pass: true },
        { value: 'bar', pass: true },
        { value: {}, pass: false }
      ],
      print: [
        { input: String('foo'), output: '"foo"' },
        { input: 'bar', output: '"bar"' }
      ]
    });
  }());

  (function() {
    typeTests('Symbol', Type.Symbol, {
      test: [
        { value: Symbol('foo'), pass: true },
        { value: 'bar', pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: Symbol('foo'), output: 'Symbol(foo)' }
      ]
    });
  }());

  (function() {
    typeTests('Undefined', Type.Undefined, {
      test: [
        { value: undefined, pass: true },
        { value: null, pass: false },
        { value: {}, pass: false }
      ],
      print: [
        { input: undefined, output: 'undefined' }
      ]
    });
  }());
});
