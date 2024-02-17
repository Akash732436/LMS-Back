const express = require("express");
const mongoose = require("mongoose");
const ConnectToDb = require("./Config/dbConnection");
const env = require("dotenv").config();
const apiRoutes = require("./Routes/apiRoutes");

//connecting to the dataBase
ConnectToDb();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

app.use("/api",apiRoutes);


app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

