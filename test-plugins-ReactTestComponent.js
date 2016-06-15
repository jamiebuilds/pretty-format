'use strict';
var assert = require('assert');
var print = require('./');
var React = require('react');
var ReactTestComponent = require('./plugins/ReactTestComponent');
var renderer = require('react/lib/ReactTestRenderer');

describe('ReactTestComponent', function(){
  var Mouse = React.createClass({
    getInitialState: function(){
      return {
        mouse: 'mouse'
      }
    },
    handleMoose: function() {
      this.setState({mouse: 'moose'});
    },
    render: function() {
      return React.createElement('div', null, this.state.mouse);
    }
  });

  var tests = [
    renderer.create(React.createElement('Mouse')),
    renderer.create(React.createElement('Mouse', {style: 'color:red'})),
    renderer.create(React.createElement('Mouse', {
      onclick: function onclick(){}
    })),
    renderer.create(
      React.createElement('Mouse', {
        customProp: {
          one: '1',
          two: 2
        }
      })
    ),
    renderer.create(
      React.createElement('Mouse', {
          customProp: {
            one: '1',
            two: 2
          }
        },
        [React.createElement('Mouse')]
      )
    ),
    renderer.create(
      React.createElement('Mouse', {
          customProp: {
            one: '1',
            two: 2
          },
          onclick: function(){}
        },
        ['HELLO', React.createElement('Mouse'), 'CIAO']
      )
    ),
    renderer.create(
      React.createElement('Mouse', {
          customProp: {
            one: '1',
            two: 2
          },
          onclick: function(){}
        },
        [
          'HELLO',
          React.createElement('Mouse', {
            customProp: {
              one: '1',
              two: 2
              },
              onclick: function(){}
            },
            ['HELLO', React.createElement('Mouse'), 'CIAO']
          ),
          'CIAO'
        ]
      )
    )
  ];

  var expectations = [
    '<Mouse />',
    '<Mouse\n  style="color:red" />',
    '<Mouse\n  onclick={\n    function onclick(){}\n  } />',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  } />',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }>\n  <Mouse />\n</Mouse>',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={\n    function (){}\n  }>\n  HELLO\n  <Mouse />\n  CIAO\n</Mouse>',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={\n    function (){}\n  }>\n  HELLO\n  <Mouse\n    customProp={\n      Object {\n        "one": "1",\n        "two": 2\n      }\n    }\n    onclick={\n      function (){}\n    }>\n    HELLO\n    <Mouse />\n    CIAO\n  </Mouse>\n  CIAO\n</Mouse>'
  ];

  tests.forEach(function(test, i){
    it('should match expectations ('+ i +')', function(){
      var test = tests[i].toJSON();
      var expectation = expectations[i];
      assert.equal(
        expectation,
        print(test, {
          plugins: [ReactTestComponent]
        })
      );
    });
  });
});
