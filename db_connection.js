const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;
const elasticsearchService = require('./elasticsearch/document');

mongoose.connect('mongodb+srv://biz-admin:xiT7QK5n6FK6WQEH@bizmorphic-prod.ytmpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log("DB connection success");
  })
  .catch(error => {
    console.log("DB_CONNECTION_ERROR :: ", error);
  });


mongoose.Query.prototype.exec = async function overrideExec(...params) {
  try {
    if (this.mongooseCollection.name == 'Location') {

      const cacheValue = await elasticsearchService.search({
        index: String(this.mongooseCollection.name).toLowerCase(),
        body: this.getQuery()
      });

      let hits = cacheValue.hits.hits;
      let es_result = [];
      for (const entity of hits) {
        let source = entity._source;
        source._id = source.id;
        delete source["id"];
        es_result.push(source);
      }

      if (es_result) {
        return Array.isArray(es_result)
          ? es_result.map(doc => new this.model(doc))
          : new this.model(es_result);
      }

      const result = await exec.apply(this, arguments);
      return result;
    } else {
      const result = await exec.apply(this, arguments);
      return result;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};