const providerService = require("../services/provider");

module.exports = {
    addProvider : async function (req , res , next ){
        try {
            const { format } = req.query;
            const providerData  =  req.body;
            const result = await providerService.addProvider({providerData, format});
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    updateProvider : async function(req ,res, next){
        try {
            const { format } = req.query;
            const providerData  =  req.body;
            const result = await providerService.updateProvider({providerData, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    deleteProvider: async function(req, res, next){
        try {
            const {format} = req.query;
            const providerData =  req.body;
            const result = await providerService.deleteProvider({providerData, format});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: err.message.toString()});
        }
    },
    searchProviders: async function(req, res, next){
        try {
            const { format, limit, page } = req.query;
            const searchQuery  =  req.body;
            const result = await providerService.searchProviders({searchQuery, format, limit , page});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({reason: error.message.toString()});
        }
    }

}