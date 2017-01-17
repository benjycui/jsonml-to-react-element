'use strict';

const assert = require('assert');
const toReactComponent = require('../lib');

describe('jsonml-to-react-component', function() {
  it('should return node directly when node is string', function() {
    const node = 'Hello world!';
    assert.strictEqual(toReactComponent(node), node);
  });

  it('should convert props.class to props.className', function() {
    const node = [
      'h1',
      { class: 'title' },
      'Hello world!',
    ];

    const props = toReactComponent(node).props;
    assert.strictEqual(props.className, 'title');
    assert.ok(!('class' in props));
  });

  it('should convert style string to style object', function() {
    const node = [
      'p',
      { style: 'color: red' },
      'Hello world!',
    ];

    assert.deepEqual(toReactComponent(node).props.style, { color: 'red' });
  });

  it('should not add children to standalone tag', function() {
    const node = [ 'hr' ];
    assert.strictEqual(toReactComponent(node).props.children, undefined);
  });
});
