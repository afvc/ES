var sendNotificationXML;

function sendNotificationXMLStart() {
    if (window.XMLHttpRequest) {
        notificationXML = new XMLHttpRequest();
    } else {
        notificationXML = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendNotification(message, isAlert, alertTitle) {
    sendNotificationXMLStart();
    sendNotificationXML.onreadystatechange = function () {
        if (sendNotificationXML.readyState == 4 && sendNotificationXML.status == 200) {
            sendNotificationXML.close();
        } else if (sendNotificationXML.readyState == 4) {
            window.alert(sendNotificationXML.status + " - postNotification");
        }
    }
    var host = document.getElementById("host").innerHTML;
    var username = document.getElementById("username").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;
    sendNotificationXML.open("POST", host + "/request/postNotification", true);
    var params = "username=" + username + "&projectID=" + projectID + "&message=" + message + "&isAlert=" + isAlert + "&alertTitle=" + alertTitle;
    sendNotificationXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendNotificationXML.setRequestHeader("Content-length", params.length);
    sendNotificationXML.send(params);
}