'use strict';

const React = require('react');
const JsonML = require('jsonml.js/lib/utils');

const coreToString = Object.prototype.toString;
function isObject(object) {
  return coreToString.call(object)
    .toLowerCase() === '[object object]';
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

function isStandalone(tagName) {
  return tagName === 'hr' || tagName === 'br' || tagName === 'img';
}

let cid = 0;
module.exports = function toReactComponent(jsonml, converters = []) {
  const defaultConverters = [
    [(node) => typeof node === 'string', (node) => node],
    [() => true, (node, index) => {
      const attrs = assign({ key: index }, JsonML.getAttributes(node));
      if (attrs.class) {
        attrs.className = attrs.class;
        attrs.class = undefined;
      }
      if (attrs.style) {
        attrs.style = toStyleObject(attrs.style);
      }

      const tagName = JsonML.getTagName(node);
      return React.createElement(
        tagName,
        attrs,
        isStandalone(tagName) ?
          undefined :
          JsonML.getChildren(node).map(innerToReactComponent)
      );
    }],
  ];

  const mergeConverters = converters.concat(defaultConverters);

  function innerToReactComponent(jsonml, index) {
    return cond(jsonml, mergeConverters, index);
  }

  return cond(jsonml, mergeConverters, cid++);
};
