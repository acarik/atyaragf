const mongoose = require("mongoose")
const params = require('./params.json')
const helpers = require("./helper-functions");
const Agf = require('./models/Agf.js');
const { parkurStr } = require("./helper-functions");


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

function getKosu(day, parkurNum, callback) {
    Agf.find({ day: day, parkurNum: parkurNum }.sort({ time: 1 }), function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        return callback(null, helpers.kosuSort(docs))
    })
}

function getKosuAtlar(day, parkurNum, ayakNum, callback) {
    Agf.distinct("atNum", { day: day, parkurNum: parkurNum, ayak: ayakNum }, function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        return callback(null, docs.sort())
    })
}

function getAt(day, parkurNum, ayakNum, atNum, callback) {
    Agf.find({ day: day, parkurNum: parkurNum, ayak: ayakNum, atNum: atNum }, function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        return callback(null, docs.sort())
    })
}

function getAyaklar(day, parkurNum, callback) {
    Agf.distinct("ayak", { day: day, parkurNum: parkurNum }, function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        return callback(null, docs.sort())
    })
}

function getParkurlar(day, callback) {
    Agf.distinct("parkurNum", { day: day }, function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        return callback(null, docs.sort())
    })
}

function getParkursToday(callback) {
    const currentDate = helpers.getCurrentDateString();
    const parkurs = [];
    Agf.find({ day: currentDate }, function (err, docs) {
        if (err) {
            return callback(err, null)
        }
        docs.forEach(element => {
            parkurs.push({ day: currentDate, parkurNum: element.parkurNum })
        });
        let sortedParkurs = helpers.parkurSortAndRemoveDups(parkurs);
        return callback(null, sortedParkurs);

    })
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
    getParkursToday: getParkursToday,
    getKosu: getKosu,
    getKosuAtlar: getKosuAtlar,
    getAyaklar: getAyaklar,
    getAt: getAt,
    getParkurlar: getParkurlar
}