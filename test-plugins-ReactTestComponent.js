'use strict';
const assert = require('assert');
const print = require('./');
const React = require('react');
const ReactTestComponent = require('./plugins/ReactTestComponent');
const renderer = require('react/lib/ReactTestRenderer');

describe('ReactTestComponent', function(){

  class Mouse extends React.Component {
    constructor() {
      super();
      this.state = {mouse: 'mouse'};
    }
    handleMoose() {
      this.setState({mouse: 'moose'});
    }
    render() {
      return React.createElement('div', null, this.state.mouse);
    }
  };

  const tests = [
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

  const expectations = [
    '<Mouse />',
    '<Mouse\n  style="color:red" />',
    '<Mouse\n  onclick={\n    function onclick(){}\n  } />',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  } />',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }>\n  <Mouse />\n</Mouse>',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={\n    function (){}\n  }>\n  HELLO\n  <Mouse />\n  CIAO\n</Mouse>',
    '<Mouse\n  customProp={\n    Object {\n      "one": "1",\n      "two": 2\n    }\n  }\n  onclick={\n    function (){}\n  }>\n  HELLO\n  <Mouse\n    customProp={\n      Object {\n        "one": "1",\n        "two": 2\n      }\n    }\n    onclick={\n      function (){}\n    }>\n    HELLO\n    <Mouse />\n    CIAO\n  </Mouse>\n  CIAO\n</Mouse>'
  ];

  for(let i = 0, max = tests.length; i < max; i++){
    it('should match expectations ('+ i +')', function(){
      let test = tests[i].toJSON();
      let expectation = expectations[i];
      assert.equal(
        expectation,
        print(test, {
          plugins: [ReactTestComponent]
        })
      );
    });
  }
});
