'use strict';

function toCamelCase(property) {
  return property.replace(
    /\-([a-z])/gi,
    letter => letter.replace('-', '').toUpperCase()
  );
}
exports.toCamelCase = toCamelCase;

exports.toStyleObject = function toStyleObject(styleStr) {
  const style = {};
  styleStr.split(/;\s*/g).forEach(rule => {
    const kv = rule.split(/:\s*/g);
    style[toCamelCase(kv[0])] = kv[1];
  });
  return style;
};

exports.assign = function assign(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
};

exports.cond = function cond(data, conds, index) {
  const pair = conds.filter(converter => {
    return converter[0](data);
  })[0];
  return pair[1](data, index);
};

exports.isStandalone = function isStandalone(tagName) {
  return tagName === 'hr' || tagName === 'br' || tagName === 'img';
};
