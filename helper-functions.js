function getCurrentDateString() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    return (date + month + year)

    // prints date in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    // prints time in HH:MM format
    console.log(hours + ":" + minutes);
}

function getCurrentTimeString() {
    return new Date();
}

function error(str) {
    console.log("[ERROR] " + str);

}

function log(str) {
    console.log("[LOG] " + str);
}

function parkurStr(parkurNum) {
    let str = parkurNum.toString()
    switch (parkurNum) {
        case 2:
            str = 'İzmir';
            break;
        case 3:
            str = 'İstanbul';
            break;
        case 4:
            str = 'Bursa';
            break;
        case 5:
            str = 'Ankara';
            break;
    };
    return str;
}

function parkurSortAndRemoveDups(input) {
    let out = [];
    input.forEach(elementInput => {
        let bulundu = false;
        out.forEach(elementOutput => {
            if (elementOutput.parkurNum == elementInput.parkurNum) {
                bulundu = true;
                return;
            }
        });
        if (bulundu) {
            // skip
        } else {
            out.push(elementInput);
        }
    });
    return out;
}

function kosuSort(kosular) {
    return kosular;
}

function stylizeYaris(parkur) {
    return ('/' + parkur.day + '_' + parkur.parkurNum + " (" + parkurStr(parkur.parkurNum) + ")");
}

module.exports = {
    getCurrentDateString: getCurrentDateString,
    getCurrentTimeString: getCurrentTimeString,
    error: error,
    log: log,
    parkurStr: parkurStr,
    parkurSortAndRemoveDups: parkurSortAndRemoveDups,
    stylizeYaris: stylizeYaris,
    kosuSort: kosuSort
}