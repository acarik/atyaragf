/*
params['agf-check-interval'] periyodunda,
1. Tüm şehirler için bugün koşulacak/koşulan yarışlar için AGF tablosunu oku. 
AGF tablosu url'si şu formatta:
https://www.tjk.org/AGFv2/7/17062020/TR/0
2. Eğer geçersiz sayfa gelirse atla. 
Geçersiz sayfa: 
Server Error in '/AGFV2' Application.
There is no row at position 0. 
3. Eğer geçerli bir sayfa ise yarış ve at bilgilerini agf katsayıları ile 
birlikte database'e kaydet.
*/

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const parse = require("node-html-parser").parse;
const db = require('./db.js');
const { parkurStr } = require("./helper-functions.js");
const helpers = require("./helper-functions.js");
params = require('./params.json')
global.currParkurNum = params.minParkurNum;

setInterval(agfPageParser, params.timeinterval);

function agfPageParser() {
    const currentDate = helpers.getCurrentDateString();
    //helpers.log("current date str: " + currentDate);
    // https://www.tjk.org/AGFv2/7/17062020/TR/0
    parseAgfPage(currentDate, currParkurNum)

    currParkurNum++;
    if (currParkurNum > params.maxParkurNum) {
        currParkurNum = params.minParkurNum;
    }
}

function parseAgfPage(currentDateString, parkurNum) {
    const request = require("request");
    //const url = "http://localhost:8521/dashboard/";
    const url = "https://www.tjk.org/AGFv2/" + parkurNum.toString() + "/" + currentDateString + "/TR/1/0";
    helpers.log('parsing for ' + currentDateString + " @ " + parkurNum.toString() + ", url:" + url)
    request({ uri: url }, function (error, response, body) {
        if (body.includes('Error in \'/AGFV2\' Application.')) {
            // demek ki boyle bir kosu yokmus
            helpers.log('yok boyle bir kosu, ' + parkurStr(parkurNum) + ' parkuru, ' + currentDateString + ' tarihli');
            return;
        }
        const dom = new JSDOM(body);
        //const baslik = dom.window.document.getElementById("bas").textContent;
        let ayakNo = 0;
        while (true) {
            ayakNo++;
            const tableDom = dom.window.document.getElementById("GridView" + ayakNo.toString());
            if (tableDom == null)
                break;
            const textContent = tableDom.outerHTML;
            const root = parseStructuredText(parse(textContent).structuredText);
            // db'ye kaydedelim
            root.forEach(element => {
                db.addAgf({
                    time: helpers.getCurrentTimeString(),
                    day: currentDateString,
                    parkurNum: parkurNum,
                    ayak: ayakNo,
                    atNum: element.atNum,
                    agf: element.agfOran,
                    startNum: element.startNum
                })
            });
        }
    });
}

function parseStructuredText(inputString) {
    /*for (let i = 0; i<inputString.length; i++){
        console.log(inputString[i]);
    }*/
    //"AT NO 1 7 (%22,5) 2 2 (%17,03) 3 10 (%12,79) 4 1 (%11,43) 5 6 (%10,95) 6 3 (%6,91) 7 9 (%6,17) 8 8 (%4,05) 9 4 (%3,73) 10 5 (%2,42) 11 11 (%2)"

    const words = inputString.split('/\s+/');
    let numberStrings = [];
    numberStrings[0] = [];
    let ind = 0;
    let curr = 0;
    for (let i = 0; i < inputString.length; i++) {
        let c = isNumberChar(inputString[i]);
        if (c == -1) {
            if (curr == 0) {
                // do nothing
            } else {
                curr = 0;
                ind++;
                numberStrings.push([])
            }
        } else {
            curr++;
            numberStrings[ind].push(inputString[i])
        }
    }
    numberStrings.pop();
    let numbers = [];
    for (let i = 0; i < numberStrings.length; i++) {
        let curr = [];
        numberStrings[i].forEach(element => {
            if (element == ',')
                curr += '.';
            else
                curr += element;
        });
        numbers.push(parseFloat(curr))
    }
    let table = [];
    const n = numbers.length / 3;
    for (let i = 0; i < n; i++) {

        table.push(
            {
                startNum: numbers[i * 3],
                atNum: numbers[i * 3 + 1],
                agfOran: numbers[i * 3 + 2]
            });
    }
    return table;
}

function isNumberChar(c) {
    // return number if it is a number string between 0 and 9, dot for comma. return -1 if not.
    for (let i = 0; i < 10; i++) {
        if (c == i.toString()) {
            return i;
        }
    }
    if (c == ',') {
        return '.';
    }
    return -1;
}