const locationService = require("../services/location");

module.exports = {
    addLocation : async function (req , res , next ){
        console.log("addlocation query",req.query );
        console.log("addlocation body",req.body );
        // TODO: can we do joi validation here to get the correct object, currn
        try {
            const {format} = req.query;
            const locationData  =  req.body;
            const result = await locationService.addLocation({locationData, format});
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    updateLocation : async function(req ,res, next){
        try {
            const {format} = req.query;
            const locationData  =  req.body;
            const result = await locationService.updateLocation({locationData, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    deleteLocation: async function(req, res, next){
        try {
            const {format} = req.query;
            const locationData =  req.body;
            const result = await locationService.deleteLocation({locationData, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    getLocation: async function(req, res, next){
        try {
            const {format, id} = req.query;
            const result = await locationService.getLocation({locationId: id, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    searchLocations: async function(req, res, next){
        try {
            const {format} = req.query;
            const searchQuery  =  req.body;
            const result = await locationService.searchLocations({searchQuery, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: error.message.toString()});
        }
    }

}