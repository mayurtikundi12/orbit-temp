  
    const elasticsearchService = require('../elasticsearch/document');
  
    module.exports = function elasticSearch(schema) {
  
      schema.post('save', postSave);
  
      schema.post('insertMany', function(docs){
        docs.forEach(doc => postSave(doc));
      });
      
      schema.post('findOneAndUpdate', function (doc) {
        console.log("find one and update  post hook getting called")
        const typeName = this.constructor.modelName || (this.model && this.model.modelName ? this.model.modelName : null);
        const document = new doc.constructor(doc);
        let _doc = document._doc;
        let id = _doc._id.toString();
        _doc.id = id;
        delete _doc._id;
        console.log("Doc : ", _doc);
        elasticsearchService.update({
            index:typeName,
            document: _doc,
            id:id
        }, function (err,res) {
          if (err) {
            console.error(err);
          }
          console.log(res);
        });
      });


      schema.post('remove', postRemove);


      schema.post('findOneAndRemove', postRemove);

      schema.post('findOneAndDelete', postDelete);
    }
  
    function postSave(doc) {
      console.log("POST_SAVE HOOK getting called for mognoose ", doc);
      const typeName = this.constructor.modelName || (this.model && this.model.modelName ? this.model.modelName : null);
      const document = new doc.constructor(doc);
      let _doc = document._doc;
      _doc.id = _doc._id.toString();
      delete _doc["_id"];
      elasticsearchService.create({
        index:typeName,
        document: _doc,
        id: _doc.id
      }).catch((err) => {
        if (err) {
          console.error(err.message);
        }
      });
    }

    function postDelete(doc) {
      console.log("post delete getting called ", doc);
      const typeName = this.constructor.modelName || (this.model && this.model.modelName ? this.model.modelName : null);
      const document = new doc.constructor(doc);
      const _doc = document._doc;
      const id = _doc._id.toString();
  
      elasticsearchService.deleteById({
        id: id,
        index: typeName,
      }, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }
  
    function postRemove(doc) {
  
      const typeName = this.constructor.modelName || (this.model && this.model.modelName ? this.model.modelName : null);
      const document = new doc.constructor(doc);
      const _doc = document._doc;
      const id = _doc._id.toString();
  
      elasticsearchService.deleteDocument({
        id: id,
        type: typeName
      }, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }


  