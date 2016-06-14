var reactTestInstance = Symbol.for('react.test.json');

function handleChildren(result, children, indentation, print, indent) {
  if (children) {
    children.forEach(function(child) {
      result.push('\n');
      result.push(objectToJSX(child, indentation, print, indent));
    });
    result.push('\n');
  }
}

function handleProps(result, node, indentation, print, indent) {
  var props = node.props;
  if (props) {
    var indentOpts = {
      indent: 2 * (indentation + 1)
    };
    Object.keys(props).forEach(function(prop) {
      result.push('\n', indent(prop, indentOpts), '=');
      var value = props[prop];
      if (typeof value === 'string') {
        result.push('"', value, '"');
      } else {
        var formatted = indent(print(value), {indent: 2 * (indentation + 2)});
        result.push('{\n', formatted, '\n', indent('}', indentOpts));
      }
    });
  }
}

function objectToJSX(root, indentation, print, indent) {
  indentation = indentation || 0;
  var indentationOpts = {indent: indentation * 2};
  var type = root.type;
  if (!type && typeof root === 'string'){
    return indent(root, indentationOpts);
  }
  var result = [];
  if (!root.children) {
    result.push(indent('<', indentationOpts), type);
    handleProps(result, root, indentation, print, indent);
    result.push(' />');
  } else {
    result.push(indent('<', indentationOpts), type);
    handleProps(result, root, indentation, print, indent);
    result.push('>');
    handleChildren(result, root.children, indentation + 1, print, indent);
    result.push(indent('</', indentationOpts), type, '>');
  }
  return result.join('');
}

module.exports = {
  test: function(object){
    return object && object.$$typeof === reactTestInstance;
  },
  print: function(val, print, indent){
    return objectToJSX(val, 0, print, indent);
  }
};
