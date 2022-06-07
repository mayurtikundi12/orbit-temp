const providerModel  = require('../models/provider');

const providerService = {
    addProvider : async function({providerData, format}){
        const orbitaProvider = this.transformDataFormat({provider : providerData, format, type : this.utility.CONSTANTS.MUTATION });
        const provider = await providerModel.create(orbitaProvider);
        return this.transformDataFormat({ provider , format, type: this.utility.CONSTANTS.QUERY });
    },

    updateProvider : async function({ providerData, format }){
        const orbitaProvider = this.transformDataFormat({provider: providerData, format, type : this.utility.CONSTANTS.MUTATION });
        const provider = await providerModel.findOneAndUpdate( { providerID: orbitaProvider["providerID"]} , orbitaProvider );
        return this.transformDataFormat({ provider , format, type: this.utility.CONSTANTS.QUERY });
    },

    deleteProvider: async function({providerData, format}){
        const orbitaProvider = this.transformDataFormat({provider: providerData, format, type : this.utility.CONSTANTS.MUTATION });
        const provider = await providerModel.findOneAndDelete( {providerID:orbitaProvider.providerID} );
        return this.transformDataFormat({provider , format, type: this.utility.CONSTANTS.QUERY});
    },

    searchProviders: async function({ searchQuery, format , limit=10 , page=1 }){
        const orbitaProvider = this.transformDataFormat( {provider: searchQuery, format ,  type: this.utility.CONSTANTS.MUTATION});

        for (const ol of Object.keys(orbitaProvider)) {
            if(!orbitaProvider[ol]){
                delete orbitaProvider[ol];
            }
        }

        let searchedProviders = [];
        let searchOptions = { 
            q :orbitaProvider ,
            page,
            limit
        }

        try {
            searchedProviders =  await elasticPaginate(searchOptions);
        } catch (error) {
            searchedProviders = await mongoPaginate(searchOptions);
        }

        if(Array.isArray(searchedProviders)){
            return searchedProviders.map(loc => {
                return this.transformDataFormat( {provider: loc, format ,  type: this.utility.CONSTANTS.QUERY});
            });
        }else{
            return this.transformDataFormat( {provider:searchedProviders, format ,  type: this.utility.CONSTANTS.QUERY});
        }

        async function elasticPaginate(options) {
            let rawQuery = { 
                from:( options.page - 1 ) * 10,
                size: 10 
            };
           if (options.q) rawQuery.query = { match: options.q };
           rawQuery.index="provider";

           const elasticProvidersRaw = await esClient.search(rawQuery);
           return elasticProvidersRaw.body.hits.hits.map(item => item._source);
        };
       
        async function mongoPaginate(options) {
           return new Promise( (resolve, reject) =>{
            providerModel.paginate(
                options.q,
                {
                  page: options.page,
                  limit: options.limit
                },
                function (err, providers, pageCount, itemCount, resultsCount) {
                  if (err) {
                    reject(err);
                  }
          
                  resolve({
                    providers: providers,
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

    transformDataFormat: function({provider, format, type}){
        try {
            const FORMATS = {
                "FHIR":{
                    formatName:"FHIR",
                    base_mappings:{
                        fullName :   "name.text",
    
                        familyName  :  "name.family" ,
                        
                        givenName :  "name.given" , //array
                        
                        varcommunication  : "communication" ,
                        
                        gender  : "gender" ,
                        
                        phone :  "telecom.value" 
                    },
                    external_mappings:{
                        "name.text" : "fullName" ,
                        
                        "name.family" : "familyName" ,

                        "name.given" : "givenName" , //array

                        "communication" : "varcommunication"  ,

                        "gender" : "gender"  ,
                        
                        "telecom.value" : "phone" ,
                        
                    },
                    transformToExternal:function(transformationData){
                        const formattedProvider = {};
                        for (const orbitaKey of Object.keys(this.base_mappings)) {
                            if( orbitaKey !== "N/A" ){
                                let mappedKey = this.base_mappings[orbitaKey];
                                if( mappedKey && mappedKey.includes(".") ){
                                    if(mappedKey == "name.given"){
                                        formattedProvider[ "name" ] = {};
                                        formattedProvider[ "name" ][ "given" ] = transformationData[ orbitaKey ].split(" ");
                                        continue;
                                    }

                                    let [ parentKey, childKey ] = mappedKey.split(".");

                                    if(formattedProvider.hasOwnProperty(parentKey)){
                                        formattedProvider[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }else{
                                        formattedProvider[ parentKey ] = {};
                                        formattedProvider[ parentKey ][ childKey ] = transformationData[orbitaKey];
                                    }

                                }else{
                                    formattedProvider[mappedKey] = transformationData[orbitaKey];
                                }
                            }
                        }
                        console.log("formatted object ",formattedProvider);
                        return formattedProvider;
                    },
                    transformToBase:function(transformationData){
                        const formattedProvider = {};
                        for (const externalKey of Object.keys(this.external_mappings)) {
                            let mappedKey = this.external_mappings[externalKey];
                            if(externalKey.includes(".")){
                                if(externalKey == "name.given"){
                                    (transformationData["name"] !== undefined && transformationData["name"]["given"] !== undefined) ? formattedProvider[mappedKey] = transformationData["name"]["given"].join(" ") : console.log(`Skipped ${parentKey}.${childKey} as value is undefined`);
                                }
                                let [parentKey, childKey] = externalKey.split(".");
                                (transformationData[parentKey] !== undefined && transformationData[parentKey][childKey] !== undefined) ? formattedProvider[mappedKey] = transformationData[parentKey][childKey] : console.log(`Skipped ${parentKey}.${childKey} as value is undefined`);
                            }else{
                                (transformationData[externalKey] !== undefined) ? formattedProvider[mappedKey] = transformationData[externalKey] : console.log(`Skipped ${externalKey} as value is undefined`);
                            }
                        }
    
                        return formattedProvider;
                    }    
                },
                "Orchard":{
                    formatName:"Orchard",
                    base_mappings:{
                        fullName :   "DisplayName",
    
                        familyName  :  "DisplayName" ,
                        
                        givenName :  "DisplayName" ,
                        
                        // varcommunication  : "NA" ,
                        
                        // gender  : "NA" ,
                        
                        // phone :  "NA" 
                    },
                    external_mappings:{
                        "DisplayName" : [ "fullName" , "familyName",  "givenName" ]
                    },

                    transformToExternal:function(transformationData){
                        let DisplayNameArray = [];
                        if (transformationData["fullName"]) {
                            DisplayNameArray.push(fullName);
                        }
                        const formattedProvider = {
                            "DisplayName" : DisplayNameArray 
                        };
                        
                        
                        return formattedProvider;
                    },
                    transformToBase:function(transformationData){
                        const formattedProvider = {};
                        if(transformationData["DisplayName"]){
                           let splittedDisplayName = transformationData["DisplayName"].split(" ");
                           switch (splittedDisplayName.length) {
                               case 1:
                                   formattedProvider["fullName"] = splittedDisplayName[0];
                                   break;
                               case 2:
                                    formattedProvider["fullName"] = splittedDisplayName[0];                           
                                    formattedProvider["familyName"] = splittedDisplayName[1];                           
                               case 3:
                                        formattedProvider["fullName"] = splittedDisplayName[0];                           
                                        formattedProvider["familyName"] = splittedDisplayName[1];                           
                                        formattedProvider["familyName"] = splittedDisplayName[2];   
                                   break;
                           }
                        }
    
                        return formattedProvider;
                    }                 
                }
            }
    
            if(type == this.utility.CONSTANTS.MUTATION){
                switch (format) {
                    case FORMATS.FHIR.formatName:
                        return FORMATS.FHIR.transformToBase(provider);
        
                    case FORMATS.Orchard.formatName:
                        return FORMATS.Orchard.transformToBase(provider);
        
                    default:
                        return provider;
                }
            }else if(type == this.utility.CONSTANTS.QUERY){
                switch (format) {
                    case FORMATS.FHIR.formatName:
                        return FORMATS.FHIR.transformToExternal(provider);
        
                    case FORMATS.Orchard.formatName:
                        return FORMATS.Orchard.transformToExternal(provider);
        
                    default:
                        return provider;
                }
            }else{
                return provider;
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


module.exports = providerService;