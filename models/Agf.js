const mongoose = require("mongoose");
Schema = mongoose.Schema;

// create a schema for Agf
let agfSchema = new Schema({
    time: Number,
    parkurStr: String,
    parkurNum: Number,
    ayak: Number,
    atNum: Number,
    agf: Number,
    startNum: Number
})

// Create a model using schema
let Agf = mongoose.model("agf", agfSchema)

// make this model available
module.exports = Agf;