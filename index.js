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
  if (typeof node === 'string' || !Array.isArray(node)) {
    return [];
  }

  const start = isObject(node[1]) ? 2 : 1;
  return node.slice(start);
}

function assign(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

function cond(data, conds, index) {
  const pair = conds.find(([pred, _]) => {
    return pred(data);
  });
  return pair[1](data, index);
}

function toCamelCase(property) {
  return property.replace(/\-([a-z])/gi, '$1');
}

function toStyleObject(styleStr) {
  const style = {};
  styleStr.split(/;\s*/g).forEach((rule) => {
    const kv = rule.split(/:\s*/g);
    style[toCamelCase(kv[0])] = kv[1];
  })
  return style;
}

let cid = 0;
module.exports = function toReactComponent(converters = [], jsonml) {
  const defaultConverters = [
    [(node) => typeof node === 'string', (node) => node],
    [(node) => {
      const tagName = getTagName(node);
      return tagName === 'hr' || tagName === 'br' || tagName === 'img';
    }, (node, index) => {
      return React.createElement(getTagName(node), assign({ key: index }, getAttributes(node)));
    }],
    [() => true, (node, index) => {
      const attrs = assign({ key: index }, getAttributes(node));
      if (attrs.class) {
        attrs.className = attrs.class;
        attrs.class = undefined;
      }
      if (attrs.style) {
        attrs.style = toStyleObject(attrs.style);
      }
      return React.createElement(
        getTagName(node),
        attrs,
        getChildren(node).map(innerToReactComponent)
      );
    }],
  ];

  const mergeConverters = converters.concat(defaultConverters);

  function innerToReactComponent(jsonml, index) {
    return cond(jsonml, mergeConverters, index);
  }

  return cond(jsonml, mergeConverters, cid++);
};
