    'use strict';
  
    const { Client } = require('@elastic/elasticsearch');
    const hostname = "orbita";
    const esServer = 'http://localhost:9200';
  
    let indexName = 'data-' + hostname;
    let client;
  
    function getClient() {
      if (!client) {
        client = new Client({
          node: esServer
        });
      }
      return client;
    }
  
    async function ping() {
      try {
        let client = getClient();
        return await client.ping();
      } catch (err) {
        throw new Error({
          message: 'Elastic search connection is not established'
        })
      }
    }
  
    function getIndexName(type) {
      return (type && type !== 'content' && type !== 'flowstudio' && type !== 'metric' && type !== 'answers' && type !== 'taxonomy') ? type + '-' + indexName : indexName;
    }
  
    // To test this in Instance:
    (async () => {
      console.log('Debug starts here.');
      console.log('**Ping check in Instance**');
      try {
        let pingResponse = await ping();
        console.log('ping respnse');
        console.log('Ping Status code:', pingResponse ? pingResponse.statusCode : 'Unknown status code');
        console.log(pingResponse)
      } catch (err) {
        console.log('ping error');
        console.log(err);
      }
      console.log('Debug ends here.')
    })();
    // ends here
    module.exports = {ping, getClient, getIndexName};