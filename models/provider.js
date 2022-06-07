    'use strict';
    var mongoose = require('mongoose');
    const bebaioPaginate = require("../../utilities/mongo-paginate");
    const mongoosastic = require('mongoosastic');
    const elasticSearchConnection = require("../../utilities/elastic/connection");
    const esClient = elasticSearchConnection.getClient();
    // const esMiddleware = require('../utility/elastic-mongoose-plugin');

    var ProviderSchema = mongoose.Schema({
        providerID:{type:String},
        addressStreetAndNumber:{type:String},
        addressCity:{type:String},
        addressPostalCode:{type:String},
        addressState:{type:String},
        name:{type:String},
        alias:{type:String}, 
        description:{type:String}, 
        status:{type:String},
        phone:{type:String},
        type:{type:String},
    });

    // ProviderSchema.plugin(esMiddleware);
    ProviderSchema.plugin(bebaioPaginate);
    ProviderSchema.plugin(mongoosastic, {esClient});
  
    let Provider = mongoose.model('Provider', ProviderSchema,'Provider');

    module.exports = Provider;
  