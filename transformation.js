// const locationModel  = require('../../models/integrate/location');

const locationService = {
    addLocation : async function({locationData, format}){
        const orbitaLocation = this.transformDataFormat({location : locationData, format, type : this.utility.CONSTANTS.MUTATION });
        // const location = await locationModel.create(orbitaLocation);
        const location = orbitaLocation;
        return location;
        return this.transformDataFormat({ location , format, type: this.utility.CONSTANTS.QUERY });
    },

    updateLocation : async function({ locationData, format }){
        const orbitaLocation = this.transformDataFormat({locationData, format, type : this.utility.CONSTANTS.MUTATION });
        const location = await locationModel.findOneAndUpdate( { locationId: orbitaLocation["locationId"]} , orbitaLocation );
        return this.transformDataFormat({ location , format, type: this.utility.CONSTANTS.QUERY });
    },
    deleteLocation: async function({locationId, format}){
        const location = await locationModel.findOneAndDelete( {locationId} );
        return this.transformDataFormat({location , format, type: this.utility.CONSTANTS.QUERY});
    },
    searchLocations: async function({query, format}){
        // TODO: ask andrew on which fields location can be searched
        const location = await locationModel.find( query );
        return this.transformDataFormat( location, format );
    },
    getLocation : async function({locationId, format}){
        const location = await locationModel.findById( locationId );
        return this.transformDataFormat({location , format, type: this.utility.CONSTANTS.QUERY}); 
    },

    transformDataFormat: function({location, format, type}){
        try {
            const FORMATS = {
                "FHIR":{
                    formatName:"FHIR",
                    base_mappings:{
                        locationID :   "IDs.ID",
    
                        addressStreetAndNumber  :  "address.line" ,
                        
                        addressCity :  "address.city" ,
                        
                        addressPostalCode  : "address.postalCode" ,
                        
                        addressState  : "address.state" ,
                        
                        name :  "name" ,
                        
                        alias  : "alias" ,
                        
                        description :  "description" ,
                        
                        status  : "status" ,
                        
                        phone  : "telecom.value" ,
                        
                        type  : "type.text" 
                    },
                    external_mappings:{
                        "IDs.ID" : "locationID" ,
    
                        "address.line" : "addressStreetAndNumber"  ,
                        
                        "address.city" : "addressCity" ,
                        
                        "address.postalCode" : "addressPostalCode" ,
                        
                        "address.state" : "addressState" ,
                        
                        "name"  : "name",
                        
                        "alias"  : "alias",
                        
                        "description"  : "description",
                        
                        "status"  : "status",
                        
                        "telecom.value" : "phone" ,
                        
                        "type.text" : "type" ,
                    },
                    transformToExternal:function(transformationData){
                        const formattedLocation = {};
                        for (const orbitaKey of Object.keys(this.base_mappings)) {
                            if(orbitaKey !== "N/A"){
                                
                                let mappedKey = this.base_mappings[orbitaKey];
                                
                                if(mappedKey.includes(".")){
                                    let [parentKey, childKey] = mappedKey.split(".");
                                    if(formattedLocation.hasOwnProperty(parentKey)){
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey]
                                    }else{
                                        formattedLocation[ parentKey ] = {};
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey]
                                    }
                                }
                            }
                        }
    
                        return formattedLocation;
                    },
                    transformToBase:function(transformationData){
                        const formattedLocation = {};
                        for (const externalKey of Object.keys(this.external_mappings)) {
                            let mappedKey = this.external_mappings[externalKey];
                            if(externalKey.includes(".")){
                                let [parentKey, childKey] = externalKey.split(".");
                                formattedLocation[mappedKey] = transformationData[parentKey][childKey];
                            }else{
                                formattedLocation[mappedKey] = transformationData[externalKey];
                            }
                        }
    
                        return formattedLocation;
                    }    
                },
                "Orchard":{
                    formatName:"Orchard",
                    base_mappings:{
                        locationID : "IDs.ID" ,
    
                        addressStreetAndNumber : "Address.StreetAddress" ,
                        
                        addressCity : "Address.City" ,
                        
                        addressPostalCode : "Address.PostalCode",
                        
                        addressState : "Address.State",
                        
                        name : "Name",
                        
                        alias : "N/A",
                        
                        description : "LocationInstructions",
                        
                        status : "N/A",
                        
                        phone : "Phones.Number",
                        
                        type : "Specialty.Title"
                    },
                    external_mappings:{
    
                        "IDs.ID"  : "locationID",
    
                        "Address.StreetAddress"  : "addressStreetAndNumber",
                        
                        "Address.City"  : "addressCity",
                        
                        "Address.PostalCode" : "addressPostalCode",
                        
                        "Address.State" : "addressState",
                        
                        "Name" : "name" ,
                        
                        "LocationInstructions" : "description" ,
                        
                        "Phones.Number" : "phone" ,
                        
                        "Specialty.Title"  : "type" 
                    },
                    transformToExternal:function(transformationData){
                        const formattedLocation = {};
                        for (const orbitaKey of Object.keys(this.base_mappings)) {
                            if(orbitaKey !== "N/A"){
                                
                                let mappedKey = this.base_mappings[orbitaKey];
                                
                                if(mappedKey.includes(".")){
                                    let [parentKey, childKey] = mappedKey.split(".");
                                    if(formattedLocation.hasOwnProperty(parentKey)){
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey]
                                    }else{
                                        formattedLocation[ parentKey ] = {};
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey]
                                    }
                                }
                            }
                        }
    
                        return formattedLocation;
                    },
                    transformToBase:function(transformationData){
                        const formattedLocation = {};
                        for (const externalKey of Object.keys(this.external_mappings)) {
                            let mappedKey = this.external_mappings[externalKey];
                            if(externalKey.includes(".")){
                                let [parentKey, childKey] = externalKey.split(".");
                                formattedLocation[mappedKey] = transformationData[parentKey][childKey];
                            }else{
                                formattedLocation[mappedKey] = transformationData[externalKey];
                            }
                        }
    
                        return formattedLocation;
                    }                 
                }
            }
    
            if(type == this.utility.CONSTANTS.MUTATION){
                switch (format) {
                    case FORMATS.FHIR.formatName:
                        return FORMATS.FHIR.transformToBase(location);
        
                    case FORMATS.Orchard.formatName:
                        return FORMATS.Orchard.transformToBase(location);
        
                    default:
                        return location;
                }
            }else if(type == this.utility.CONSTANTS.QUERY){
                switch (format) {
                    case FORMATS.FHIR.formatName:
                        return FORMATS.FHIR.transformToExternal(location);
        
                    case FORMATS.Orchard.formatName:
                        return FORMATS.Orchard.transformToExternal(location);
        
                    default:
                        return location;
                }
            }else{
                return location;
            }
        } catch (error) {
            console.log("error :", error)
            throw new Error("Data not available in correct format/ missing data.")
        }
    },

    utility: {
        CONSTANTS:{
            "MUTATION" : "MUTATION",
            "QUERY" : "QUERY"
        }
    }
}

module.exports = locationService;