const locationService = require('./transformation');
const FHIR_LOCATION = {
    "IDs" : {
        "ID":"123456" 
    },
    "address":{
        "line" : "someline" ,
        "city" : "tokyo" ,
        "postalCode" : "411034",
        "state" : "Texas" ,
    },
    
    "name"  : "kiran",
    
    "alias"  : "karan",
    
    "description"  : "hi hah h haha",
    
    "status"  : "single",
    
    "telecom" : {value: "+918796734456"} ,
    
    "type" : {text : "logical"} ,
};

const ORCHARD_LOCATION = {
    "IDs"  : {ID:"455666"},
    
    "Address"  :{
        "StreetAddress" :  "addressStreetAndNumber",
        "City"  : "addressCity",
        "PostalCode" : "addressPostalCode",
        "State" : "addressState",
    },

    "Name" : "name" ,
    
    "LocationInstructions" : "description" ,
    
    "Phones" : { "Number": "phone" } ,
    
    "Specialty"  : { "Title" : "type" }
}


locationService.addLocation({
    locationData: FHIR_LOCATION,
    format: "FHIR"
}).then(tranformed_data=>{
    console.log(tranformed_data);
}).catch(error=>{
    console.log("Error: ",error);
});


// locationService.addLocation({
//     locationData: ORCHARD_LOCATION,
//     format: "Orchard"
// }).then(tranformed_data=>{
//     console.log(tranformed_data);
// }).catch(error=>{
//     console.log("Error: ",error);
// });


