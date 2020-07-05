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

const helpers = require("./helper-functions.js");
const currentDate = helpers.getCurrentDateString();
helpers.log("current date str: " + currentDate);
// https://www.tjk.org/AGFv2/7/17062020/TR/0
parseAgfPage(currentDate, 2)

function parseAgfPage(currentDateString, cityNum) {
    const request = require("request");
    const url = "http://localhost:8521/dashboard/";//"https://www.tjk.org/AGFv2/" + cityNum.toString() + "/" + currentDateString + "/TR/0";
    request({ uri: url }, function (error, response, body) {
        const dom = new JSDOM(body);
        //const baslik = dom.window.document.getElementById("bas").textContent;
        let ayakNo = 0;
        while (true) {
            ayakNo++;
            const textContent = dom.window.document.getElementById("GridView" + ayakNo.toString()).outerHTML;
            const root = parseStructuredText(parse(textContent).structuredText);
            debugger
        }
        debugger
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
    debugger
}

function isNumberChar(c) {
    // return number if it is a number string between 0 and 9, dot for comma. return -1 if not.
    for (let i = 0; i < 10; i++) {
        if (c == i.toString()) {
            return i;
        }
    }
    if (c==','){
        return '.';
    }
    return -1;
}