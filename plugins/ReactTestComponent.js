var reactTestInstance = Symbol.for('react.test.json');

function getIndentString(indent) {
  return Array.from(
    Array(indent)
  ).map(function() {
    return '  ';
  }).join('');
}

function handleChildren(result, children, indent, print) {
  if (children) {
    children.forEach(function(child) {
      result.push('\n');
      result.push(objectToJSX(child, indent, print));
    });
    result.push('\n');
  }
}

function handleProps(result, node, indent, print) {
  var props = node.props;
  if (props) {
    Object.keys(props).forEach(function(prop) {
      var indentString = getIndentString(indent + 1);
      result.push('\n', indentString, prop, '=');
      var value = props[prop];
      if (typeof value === 'string') {
        result.push('"', value, '"');
      } else {
        var formatted = print(value);
        var reindentation = getIndentString(indent + 2);
        var reindented = formatted.split('\n').map(line => reindentation + line).join('\n');
        result.push('{\n', reindented, '\n', indentString, '}');
      }
    })
  }
}

function objectToJSX(root, indent, print) {
  indent = indent || 0;
  var indentString = getIndentString(indent);
  var type = root.type;
  if (!type && typeof root === 'string'){
    return indentString + root;
  }
  var result = [];
  if (!root.children) {
    result.push(indentString, '<', type);
    handleProps(result, root, indent, print);
    result.push(' />');
  } else {
    result.push(indentString, '<', type);
    handleProps(result, root, indent, print);
    result.push('>');
    handleChildren(result, root.children, indent+1, print);
    result.push(indentString, '</', type, '>');
  }
  return result.join('')
}

module.exports = {
  test: function(object){
    return object && object.$$typeof === reactTestInstance;
  },
  print: function(val, print){
    return objectToJSX(val, 0, print);
  }
};
