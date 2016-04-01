'use strict';

const React = require('react');

const coreToString = Object.prototype.toString;
function isObject(object) {
  return coreToString.call(object)
    .toLowerCase() === '[object object]';
}

function getTagName(node) {
  if (typeof node === 'string') return;
  return node[0];
}

function getAttributes(node) {
  if (typeof node === 'string' ||
      !isObject(node[1])) {
    return {};
  }
  return node[1];
}

function getChildren(node) {
  if (typeof node === 'string') {
    return [];
  };
  const start = isObject(node[1]) ? 2 : 1;
  return node.slice(start);
}

function cond(data, conds) {
  const pair = conds.find(([pred, _]) => {
    return pred(data);
  });
  return pair[1](data);
}

module.exports = function toReactComponent(converters = [], jsonml) {
  const defaultConverters = [
    [(node) => typeof node === 'string', (node) => node],
    [(node) => getTagName(node) === 'innerHTML', (node) => {
      return React.createElement('div', {
        dangerouslySetInnerHTML: {__html: node[1]}
      });
    }],
    [() => true, (node) => {
      return React.createElement(
        getTagName(node),
        getAttributes(node),
        getChildren(node).map(innerToReactComponent)
      );
    }],
  ];

  const mergeConverters = converters.concat(defaultConverters);

  function innerToReactComponent(jsonml) {
    return cond(jsonml, mergeConverters);
  }

  return cond(jsonml, mergeConverters);
};
