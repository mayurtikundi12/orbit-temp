    'use strict';
  
    const connection = require('./connection')
  
    async function create(options) {
      try {
  
        let client = connection.getClient();
        let createRes = await client.index({
          index: String(options.index).toLowerCase(),
          document: options.document,
          id:options.id
        });
        return createRes;
      } catch (err) {
        console.log("error in create index function ",err)
        throw err;
      }
    }
  
    async function update(options) {
      console.log("ES update getting called :::: ",options)
      try {
        let client = connection.getClient();
        return await client.update({
          index: String(options.index).toLowerCase(),
          id: options.id,
          document: options.document
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

    async function deleteById(options) {
      console.log("delete by id called with options ", options);
      try {
        let client = connection.getClient();
        return await client.delete({
          index: String(options.index).toLowerCase(),
          id: String(options.id)
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
       deleteByQuery,
       deleteById
    }
  

  