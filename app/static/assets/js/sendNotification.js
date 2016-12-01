var sendNotificationXML;

function sendNotificationXMLStart() {
    if (window.XMLHttpRequest) {
        sendNotificationXML = new XMLHttpRequest();
    } else {
        sendNotificationXML = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendNotification(message, isAlert, alertTitle) {
    sendNotificationXMLStart();
    sendNotificationXML.onreadystatechange = function () {
        if (sendNotificationXML.readyState == 4 && sendNotificationXML.status == 200) {
            
        } else if (sendNotificationXML.readyState == 4 && sendNotificationXML.status == 401) {
            window.alert("[ERROR] - postNotification: " + sendNotificationXML.status + " - please re login!");
        } else if (sendNotificationXML.readyState == 4) {
            window.alert("[ERROR] - postNotification: " + sendNotificationXML.status);
        }
    }

    var host = document.getElementById("host").innerHTML;

    sendNotificationXML.open("POST", host + "/request/postNotification", true); // A project must be select | A user must be logged in | Sends notification to all users of selected project
    var params = "projectID=" + projectID + "&message=" + message + "&isAlert=" + isAlert + "&alertTitle=" + alertTitle;
    sendNotificationXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendNotificationXML.setRequestHeader("Content-length", params.length);
    sendNotificationXML.send(params);
}