"use strict";
  
const provider = require("../controllers/provider");
  
module.exports = function (app) {
  app.post("/api/integrate/provider", provider.addProvider);
  app.post("/api/integrate/provider/search", provider.searchProviders);
  app.put("/api/integrate/provider", provider.updateProvider);
  app.delete("/api/integrate/provider", provider.deleteProvider);
};