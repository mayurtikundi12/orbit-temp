const locationModel  = require('../models/location');

const locationService = {
    addLocation : async function({locationData, format}){
        const orbitaLocation = this.transformDataFormat({location : locationData, format, type : this.utility.CONSTANTS.MUTATION });
        const location = await locationModel.create(orbitaLocation);
        return this.transformDataFormat({ location , format, type: this.utility.CONSTANTS.QUERY });
    },

    updateLocation : async function({ locationData, format }){
        const orbitaLocation = this.transformDataFormat({location: locationData, format, type : this.utility.CONSTANTS.MUTATION });
        const location = await locationModel.findOneAndUpdate( { locationID: orbitaLocation["locationID"]} , orbitaLocation );
        return this.transformDataFormat({ location , format, type: this.utility.CONSTANTS.QUERY });
    },

    deleteLocation: async function({locationData, format}){
        const orbitaLocation = this.transformDataFormat({location: locationData, format, type : this.utility.CONSTANTS.MUTATION });
        const location = await locationModel.findOneAndDelete( {locationID:orbitaLocation.locationID} );
        return this.transformDataFormat({location , format, type: this.utility.CONSTANTS.QUERY});
    },

    searchLocations: async function({ searchQuery, format , limit=10 , page=1 }){
        const orbitaLocation = this.transformDataFormat( {location: searchQuery, format ,  type: this.utility.CONSTANTS.MUTATION});

        for (const ol of Object.keys(orbitaLocation)) {
            if(!orbitaLocation[ol]){
                delete orbitaLocation[ol];
            }
        }

        let searchedLocations = [];
        let searchOptions = { 
            q :orbitaLocation ,
            page,
            limit
        }

        try {
            searchedLocations =  await elasticPaginate(searchOptions);
        } catch (error) {
            searchedLocations = await mongoPaginate(searchOptions);
        }

        if(Array.isArray(searchedLocations)){
            return searchedLocations.map(loc => {
                return this.transformDataFormat( {location: loc, format ,  type: this.utility.CONSTANTS.QUERY});
            });
        }else{
            return this.transformDataFormat( {location:searchedLocations, format ,  type: this.utility.CONSTANTS.QUERY});
        }

        async function elasticPaginate(options) {
            let rawQuery = { 
                from:( options.page - 1 ) * 10,
                size: 10 
            };
           if (options.q) rawQuery.query = { match: options.q };
           rawQuery.index="location";

           const elasticLocationsRaw = await esClient.search(rawQuery);
           return elasticLocationsRaw.body.hits.hits.map(item => item._source);
        };
       
        async function mongoPaginate(options) {
           return new Promise( (resolve, reject) =>{
            locationModel.paginate(
                options.q,
                {
                  page: options.page,
                  limit: options.limit
                },
                function (err, locations, pageCount, itemCount, resultsCount) {
                  if (err) {
                    reject(err);
                  }
          
                  resolve({
                    locations: locations,
                    paging: {
                      pageCount: pageCount,
                      currentPage: options.page,
                      itemCount: itemCount.length,
                      resultsCount: resultsCount,
                      hasMore: {
                        hasPrevious: options.page > 1,
                        hasNext: options.page < pageCount,
                      },
                    },
                  });
                }
              );
           });
        };

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
                            if( orbitaKey !== "N/A" ){
                                let mappedKey = this.base_mappings[orbitaKey];
                                if( mappedKey && mappedKey.includes(".") ){
                                    let [ parentKey, childKey ] = mappedKey.split(".");

                                    if(formattedLocation.hasOwnProperty(parentKey)){
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }else{
                                        formattedLocation[ parentKey ] = {};
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }

                                }else{
                                    formattedLocation[mappedKey] = transformationData[orbitaKey];
                                }
                            }
                        }
                        console.log("formatted object ",formattedLocation);
                        return formattedLocation;
                    },
                    transformToBase:function(transformationData){
                        const formattedLocation = {};
                        for (const externalKey of Object.keys(this.external_mappings)) {
                            let mappedKey = this.external_mappings[externalKey];
                            if(externalKey.includes(".")){
                                let [parentKey, childKey] = externalKey.split(".");
                                (transformationData[parentKey] !== undefined && transformationData[parentKey][childKey] !== undefined) ? formattedLocation[mappedKey] = transformationData[parentKey][childKey] : console.log(`Skipped ${parentKey}.${childKey} as value is undefined`);
                                // formattedLocation[mappedKey] = transformationData[parentKey][childKey];
                            }else{
                                (transformationData[externalKey] !== undefined) ? formattedLocation[mappedKey] = transformationData[externalKey] : console.log(`Skipped ${externalKey} as value is undefined`);
                                // formattedLocation[mappedKey] = transformationData[externalKey];
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
                            if( orbitaKey !== "N/A" ){
                                let mappedKey = this.base_mappings[orbitaKey];
                                if( mappedKey && mappedKey.includes(".") ){
                                    let [ parentKey, childKey ] = mappedKey.split(".");

                                    if(formattedLocation.hasOwnProperty(parentKey)){
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }else{
                                        formattedLocation[ parentKey ] = {};
                                        formattedLocation[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }

                                }else{
                                    formattedLocation[mappedKey] = transformationData[orbitaKey];
                                }
                            }
                        }
                        console.log("formatted object ",formattedLocation);
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