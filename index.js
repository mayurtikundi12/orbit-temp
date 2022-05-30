const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const db_connection = require('./db_connection');
const routes = require("./routes/location");
app.use(bodyParser.json());
routes(app);

app.listen(3000, error=>{
  if(error){
    console.log(error);
  }else{
    console.log("Server started success");
  }
})