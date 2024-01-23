const mongoose = require("mongoose");



const ConnectToDb = async ()=>{
    const connect = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log("Host  connected:",connect.connection.host);    
    console.log("Database connected: ",connect.connection.name)
}


module.exports = ConnectToDb