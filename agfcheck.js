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


const helpers = require("./helper-functions.js");
const currentDate = helpers.getCurrentDateString();
helpers.log("current date str: " + currentDate);
// https://www.tjk.org/AGFv2/7/17062020/TR/0
var html2json = require('html2json').html2json;
parseAgfPage(currentDate, 2)

function parseAgfPage(currentDateString, cityNum) {
    const request = require("request");
    const url = "http://localhost:8521/dashboard/";//"https://www.tjk.org/AGFv2/" + cityNum.toString() + "/" + currentDateString + "/TR/0";
    request({ uri: url }, function (error, response, body) {
        //console.log(body);
        let j = html2json(body);
        debugger
    });
}
