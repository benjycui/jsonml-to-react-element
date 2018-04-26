'use strict';

const React = require('react');
const JsonML = require('jsonml.js/lib/utils');
const utils = require('./utils');

let cid = 0;
module.exports = function toReactComponent(jsonml, converters = []) {
  const defaultConverters = [
    [ node => JsonML.getTagName(node) === 'style', (node, index) => {
      const tagName = JsonML.getTagName(node);
      const attrs = JsonML.getAttributes(node);
      const styles = JsonML.getChildren(node)[0];
      return React.createElement(tagName, utils.assign({
        key: index,
        dangerouslySetInnerHTML: {
          __html: styles,
        },
      }, attrs));
    } ],
    [ node => typeof node === 'string', node => node ],
    [ () => true, (node, index) => {
      const attrs = utils.assign({ key: index }, JsonML.getAttributes(node));
      if (attrs.class) {
        attrs.className = attrs.class;
        delete attrs.class;
      }
      if (attrs.style) {
        attrs.style = utils.toStyleObject(attrs.style);
      }
      if (attrs.src) {
        attrs.src = utils.sanitizeUrl(attrs.src);
      }
      if (attrs.href) {
        attrs.href = utils.sanitizeUrl(attrs.href);
      }

      const tagName = JsonML.getTagName(node);
      return React.createElement(
        tagName,
        utils.reactifyAttrs(attrs),
        utils.isStandalone(tagName) ?
          undefined :
          JsonML.getChildren(node).map(innerToReactComponent)
      );
    } ],
  ];

  const mergeConverters = converters.concat(defaultConverters);

  function innerToReactComponent(jsonml, index) {
    return utils.cond(jsonml, mergeConverters, index);
  }

  return utils.cond(jsonml, mergeConverters, cid++);
};
