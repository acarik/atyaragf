const mongoose = require("mongoose")
const params = require('./params.json')
const helpers = require("./helper-functions");
const Agf = require('./models/Agf.js')


mongoose.connect(params.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on("connected", function () {
    helpers.log("Connected to db.")
})


function addAgf() {
    checkConnection();

}

function checkConnection() {
    if (mongoose.connection.readyState) {
        helpers.log("Connection OK.")
    }else{
        helpers.error("Connection error.")
    }
}

module.exports = {
    addAgf: addAgf
}