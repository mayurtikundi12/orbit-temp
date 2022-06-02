    'use strict';
    var mongoose = require('mongoose');
    const esMiddleware = require('../utility/elastic-mongoose-plugin');

    var LocationSchema = mongoose.Schema({
        locationID:{type:String},
        addressStreetAndNumber:{type:String},
        addressCity:{type:String},
        addressPostalCode:{type:String},
        addressState:{type:String},
        name:{type:String},
        alias:{type:String}, //dn
        description:{type:String}, //dn
        status:{type:String},
        phone:{type:String},
        type:{type:String},
    });

    LocationSchema.plugin(esMiddleware);
  
    let Location = mongoose.model('Location', LocationSchema,'Location');

    module.exports = Location;
  