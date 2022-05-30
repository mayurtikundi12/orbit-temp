"use strict";
  
const location = require("../controllers/location");
  
module.exports = function (app) {
  app.get("/api/integrate/location/:id", location.getLocation);
  app.post("/api/integrate/location", location.addLocation);
  app.post("/api/integrate/location/search", location.searchLocations);
  app.put("/api/integrate/location", location.updateLocation);
  app.delete("/api/integrate/location", location.deleteLocation);
};