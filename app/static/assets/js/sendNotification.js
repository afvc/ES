var http;

function xmlStart() {
    http = new XMLHttpRequest();
}

function sendNotification(message, isAlert, alertTitle) {
    xmlStart();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            //console.log(http.status);
        } else if (http.readyState == 4) {
            window.alert(http.status + " postNotification");
        }
    }
    var host = document.getElementById("host").innerHTML;
    var username = document.getElementById("username").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;
    http.open("POST", host + "/request/postNotification", true);
    var params = "username=" + username + "&projectID=" + projectID + "&message=" + message + "&isAlert=" + isAlert + "&alertTitle=" + alertTitle;
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Content-length", params.length);
    http.send(params);
}