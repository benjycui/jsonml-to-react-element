'use strict';

const React = require('react');
const JsonML = require('jsonml.js/lib/utils');
const utils = require('./utils');

let cid = 0;
module.exports = function toReactComponent(jsonml, converters = []) {
  const defaultConverters = [
    [(node) => typeof node === 'string', (node) => node],
    [() => true, (node, index) => {
      const attrs = utils.assign({ key: index }, JsonML.getAttributes(node));
      if (attrs.class) {
        attrs.className = attrs.class;
        delete attrs.class;
      }
      if (attrs.style) {
        attrs.style = utils.toStyleObject(attrs.style);
      }

      const tagName = JsonML.getTagName(node);
      return React.createElement(
        tagName,
        attrs,
        utils.isStandalone(tagName) ?
          undefined :
          JsonML.getChildren(node).map(innerToReactComponent)
      );
    }],
  ];

  const mergeConverters = converters.concat(defaultConverters);

  function innerToReactComponent(jsonml, index) {
    return utils.cond(jsonml, mergeConverters, index);
  }

  return utils.cond(jsonml, mergeConverters, cid++);
};
