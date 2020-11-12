const mongoose = require("mongoose")
const params = require('./params.json')
const helpers = require("./helper-functions");
const Agf = require('./models/Agf.js')


mongoose.connect(params.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on("connected", function () {
    helpers.log("Connected to db.")
    //deleteAll();
})


function addAgf(agfinfo) {
    checkConnection();
    const agf = new Agf(agfinfo);
    agf.save(function (error) {
        if (error) {
            helpers.error("Error saving new agf\n" + agf)
        } else {
            //helpers.log("Successfully saved agf\n" + agf)
        }
    })
}

function getAll() {
    Agf.find(function (error, agfs) {
        if (error) return helpers.error(error);
        helpers.log(agfs)
        helpers.log("Total of " + agfs.length.toString() + " elements")
    })
}

function getParkursToday() {
    const currentDate = helpers.getCurrentDateString();
    const parkurs = [];
    Agf.find({ day: currentDate }, function (err, docs) {
        docs.forEach(element => {
            parkurs.push(element.parkurNum)
        });
        if (parkurs.length == 0){
            return "bugun yaris bulunamadi."
        }else{
            let sortedParkurs = helpers.sortAndRemoveDups(parkurs);
            return sortedParkurs;
        }
    })
}

function deleteAll() {
    Agf.deleteMany(function (error, res) {
        if (error) return helpers.error(error);
        helpers.log("deleted all elements in db")
    });
}

function checkConnection() {
    if (mongoose.connection.readyState) {
        //helpers.log("Connection OK.")
    } else {
        helpers.error("Connection error.")
    }
}

module.exports = {
    addAgf: addAgf,
    getAll: getAll,
    getParkursToday: getParkursToday
}