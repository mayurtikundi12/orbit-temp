(function () {
    'use strict';
  
    const connection = require('./connection')
  
    async function createIndex(options) {
      try {
        let client = connection.getClient();
        return await client.indices.create({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function exists(options) {
      try {
        let client = connection.getClient();
        return await client.indices.exists({
          index: options.index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function deleteIndex(options) {
      try {
        let client = connection.getClient();
        return await client.indices.delete({
          index: options.index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function createMapping(options) {
      try {
        let client = connection.getClient();
        return await client.indices.create({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function updateMapping(options) {
      try {
        let client = connection.getClient();
        return await client.indices.putMapping({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    function getDataTypes() {
      return {
        core: ['text', 'keyword', 'long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float', 'date', 'boolean', 'binary', 'integer_range', 'float_range', 'long_range', 'double_range', 'date_range'],
        complex: ['object', 'nested'],
        geo: ['geo_point', 'geo_shape'],
        special: ['ip', 'completion', 'token_count', 'murmur3', 'annotated-text']
      };
    }
  
    function isValidType(dataType) {
      var types = getDataTypes();
      var isValid = false;
      for (var type in types) {
        if (types[type].indexOf(dataType) >= 0) {
          isValid = true;
          break;
        }
      }
      return isValid;
    }
  
    exports.createIndex = createIndex;
    exports.exists = exists;
    exports.deleteIndex = deleteIndex;
    exports.createMapping = createMapping;
    exports.updateMapping = updateMapping;
    exports.isValidType = isValidType;
  }());