'use strict';

const React = require('react');

const defaultConverters = [
  [() => true, () => 'hello'],
];

function cond(data, conds) {
  const pair = conds.find(([pred, _]) => {
    return pred(data);
  });
  return pair[1](data);
}

module.exports = function toReactComponent(jsonml, converters=[]) {
  return cond(jsonml, converters.concat(defaultConverters));
};
