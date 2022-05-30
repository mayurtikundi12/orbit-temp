    'use strict';
  
    const connection = require('./connection')
  
    async function create(options) {
      try {
  
        let client = connection.getClient();
        let createRes = await client.index({
          index: String(options.index).toLowerCase(),
          document: options.document
        });
        return createRes;
      } catch (err) {
        console.log("error in create index function ",err)
        throw err;
      }
    }
  
    async function update(options) {
      try {
        let client = connection.getClient();
        return await client.update({
          index: options.index,
          id: options.id,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function remove(options) {
      try {
        let client = connection.getClient();
        return await client.delete({
          index: options.index,
          id: options.id
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function search(options) {
      try {
        console.log("options for search ", options);
        let client = connection.getClient();
        let result =  await client.search({
          index: options.index,
          query: {match: options.body}
        });
        console.log("ES RESULT ", result);
        return result;
      } catch (err) {
        throw err;
      }
    }
  
    async function bulk(options) {
      try {
        let client = connection.getClient();
        await client.bulk({
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function deleteByQuery(options) {
      try {
        let client = connection.getClient();
        return await client.deleteByQuery({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    async function deleteByQuery(options) {
      try {
        let client = connection.getClient();
        return await client.deleteByQuery({
          index: options.index,
          body: options.body
        });
      } catch (err) {
        throw err;
      }
    }
  
    module.exports = {
       create,
       update,
       remove,
       search,
       bulk,
       deleteByQuery
    }
  

  