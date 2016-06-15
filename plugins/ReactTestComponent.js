var reactTestInstance = Symbol.for('react.test.json');

function handleChildren(children, indentation, print, indent) {
  var result = '';
  if (children) {
    children.forEach(function(child) {
      result += '\n' + objectToJSX(child, indentation, print, indent);
    });
    result += '\n';
  }
  return result;
}

function handleProps(node, indentation, print, indent) {
  var props = node.props;
  var result = '';
  if (props) {
    var indentOpts = {
      indent: 2 * (indentation + 1)
    };
    Object.keys(props).forEach(function(prop) {
      result += '\n' + indent(prop, indentOpts) + '=';
      var value = props[prop];
      if (typeof value === 'string') {
        result += '"' + value + '"';
      } else {
        var formatted = indent(print(value), {indent: 2 * (indentation + 2)});
        result += '{\n' + formatted + '\n' + indent('}', indentOpts);
      }
    });
  }
  return result;
}

function objectToJSX(root, indentation, print, indent) {
  indentation = indentation || 0;
  var indentationOpts = {indent: indentation * 2};
  var type = root.type;
  if (!type && typeof root === 'string'){
    return indent(root, indentationOpts);
  }
  var result = '';
  if (!root.children) {
    result += indent('<', indentationOpts) + type;
    result += handleProps(root, indentation, print, indent);
    result += ' />';
  } else {
    result += indent('<', indentationOpts) + type;
    result += handleProps(root, indentation, print, indent);
    result += '>';
    result += handleChildren(root.children, indentation + 1, print, indent);
    result += indent('</', indentationOpts) + type + '>';
  }
  return result;
}

module.exports = {
  test: function(object){
    return object && object.$$typeof === reactTestInstance;
  },
  print: function(val, print, indent){
    return objectToJSX(val, 0, print, indent);
  }
};
