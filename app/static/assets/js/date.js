function startContent() {
    startTime();
}

function startTime() {
    var today = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var monthN = new Array(12);
    monthN[0] = "January";
    monthN[1] = "February";
    monthN[2] = "March";
    monthN[3] = "April";
    monthN[4] = "May";
    monthN[5] = "June";
    monthN[6] = "July";
    monthN[7] = "August";
    monthN[8] = "September";
    monthN[9] = "October";
    monthN[10] = "November";
    monthN[11] = "December";
    var dayW = weekday[today.getDay()];
    var day = today.getDate();
    var month = monthN[today.getMonth()];
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById("date").innerHTML = dayW + ", " + day + " " + month + " of " + year + ", " + h + ":" + m;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}