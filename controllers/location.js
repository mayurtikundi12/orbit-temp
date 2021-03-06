const locationService = require("../services/location");

module.exports = {
    addLocation : async function (req , res , next ){
        try {
            const { format } = req.query;
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
            const { format } = req.query;
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
    searchLocations: async function(req, res, next){
        try {
            const { format, limit, page } = req.query;
            const searchQuery  =  req.body;
            const result = await locationService.searchLocations({searchQuery, format, limit , page});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: error.message.toString()});
        }
    }

}