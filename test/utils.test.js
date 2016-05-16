'use strict';

const assert = require('assert');
const utils = require('../lib/utils');

describe('utils', function() {
  describe('#toCamelCase', function() {
    it('should convert dash case to camel case', function() {
      assert.strictEqual(utils.toCamelCase('text-align'), 'textAlign');
    });

    it('should return camel case directly', function() {
      assert.strictEqual(utils.toCamelCase('textAlign'), 'textAlign');
    });
  });

  describe('#toStyleObject', function() {
    it('should convert style string to object', function() {
      const style = 'color: red';
      assert.deepEqual(utils.toStyleObject(style), {
        color: 'red',
      });
    });
  });

  describe('#assign', function() {
    it('should merge source to target', function() {
      const target = { name: 'Benjy' };
      const source = { age: 18 };
      utils.assign(target, source);
      assert.deepEqual(target, {
        name: 'Benjy',
        age: 18,
      });
    });
  });

  describe('#isStandalone', function() {
    it('should works', function() {
      assert.ok(utils.isStandalone('hr'));
      assert.ok(utils.isStandalone('br'));
      assert.ok(utils.isStandalone('img'));
    });
  });
});
