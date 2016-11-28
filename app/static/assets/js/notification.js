var notificationXML;
var notificationJsonObject;

function notificationXMLStart() {
    if (window.XMLHttpRequest) {
        notificationXML = new XMLHttpRequest();
    } else {
        notificationXML = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function startNotification() {
    getNotification();
    var t = setTimeout(startNotification, 3000);
}

function getNotification() {
    notificationXML.onreadystatechange = function () {
        if (notificationXML.readyState == 4 && notificationXML.status == 200) {
            notificationJsonObject = JSON.parse(notificationXML.responseText);
            //console.log(notificationJsonObject);
            fillNotifications();
        } else if (notificationXML.readyState == 4) {
            notificationJsonObject = JSON.parse(notificationXML.responseText);
            window.alert(notificationXML.status + " - getNotification: " + notificationJsonObject.message);
        }
    }
    var host = document.getElementById("host").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;
    var username = document.getElementById("username").innerHTML;
    notificationXML.open("GET", host + "/request/getNotification/" + username + "/" + projectID, true);
    notificationXML.send();
}

function fillNotifications() {
    var text = document.getElementById("hiddenFeed").innerHTML;
    var aux = "";
    var first = false;
    for (var i = 0; i < notificationJsonObject.length; i++) {
        if (document.getElementById("id_notif_" + notificationJsonObject[i].id_notif) == null) {
            if (notificationJsonObject[i].isAlert) {
                aux = aux + '<p id="id_notif_' + notificationJsonObject[i].id_notif + '">[USER ALERT] ' + notificationJsonObject[i].message + '</p>';
                if (!first) {
                    document.getElementById("userAlerts").innerHTML = notificationJsonObject[i].alertTitle;
                    first = true;
                }
            } else
                aux = aux + '<p id="id_notif_' + notificationJsonObject[i].id_notif + '">[NOTIFICATION] ' + notificationJsonObject[i].message + '</p>';
        }
    }

    text = aux + text;
    document.getElementById("hiddenFeed").innerHTML = text;
}

notificationXMLStart();
startNotification();