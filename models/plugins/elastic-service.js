
(function () {
    'use strict';
  
    const connection = require('../../elasticsearch/connection');
    const document = require('../../elasticsearch/document');
    const indices = require('../../elasticsearch//indices');
  
    async function create(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
      let body = options.body;
      delete body._id;
  
      try {
        return await document.create({
          id: options.id,
          body: body,
          index: index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function createGlobal(options) {
      let index = options.index
      let body = options.body;
  
      try {
        return await document.create({
          body: body,
          index: index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function update(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
      let body = options.body;
      delete body._id;
  
      try {
        return await document.update({
          id: options.id,
          body: body,
          index: index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function remove(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
  
      try {
        return await document.remove({
          id: options.id,
          index: index
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function search(options) {
      try {
        return await document.search({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function bulk(options) {
      try {
        return await document.bulk({
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function deleteIndex(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
      try {
        await indices.deleteIndex({
          index: index
        });
      } catch (err) {
        throw err;
      }
    }
  
    function convertToBulkArray(data, newData, type) {
      if (data && Array.isArray(data)) {
        let node;
        let index = connection.getIndexName('content');
        index = `${index}.${type}`;
        for (var i = 0; i < data.length; i++) {
          node = {};
          node = {
            update: {
              '_index': index
            }
          };
          node.update._id = data[i].id;
          newData.push(node);
          delete data[i]._id;
          newData.push({ doc: data[i], 'doc_as_upsert': true });
          if (Array.isArray(data[i].children)) {
            convertToBulkArray(data[i].children, newData, type);
          }
        }
  
      }
      return newData;
    };
  
    async function deleteIndexType(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
      try {
        await indices.deleteIndex({
          index: index,
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function updateIndexType(options) {
      try {
        await indices.deleteIndex({
          index: options.keyName,
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function deleteByQuery(options) {
      let index = connection.getIndexName(options.type);
      index = `${index}.${options.name}`;
  
      try {
        return await document.deleteByQuery({
          index: index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
  
    }
  
    exports.create = create;
    exports.createGlobal = createGlobal;
    exports.update = update;
    exports.remove = remove;
    exports.search = search;
    exports.bulk = bulk;
    exports.deleteIndex = deleteIndex;
    exports.deleteIndexType = deleteIndexType;
    exports.updateIndexType = updateIndexType;
    exports.convertToBulkArray = convertToBulkArray;
    exports.deleteByQuery = deleteByQuery;
  }());