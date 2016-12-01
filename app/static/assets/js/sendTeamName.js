var sendTeamNameXML;

function getTeamName() {
    teamName = prompt("Please enter a name for this team! (max 30 chars)");

    if (teamName != null) {
        sendTeamName(teamName);
        document.getElementById("teamname").innerHTML = teamName;
    }
}

function sendTeamNameXMLStart() {
    if (window.XMLHttpRequest) {
        sendTeamNameXML = new XMLHttpRequest();
    } else {
        sendTeamNameXML = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendTeamName(teamName) {
    sendTeamNameXMLStart();
    sendTeamNameXML.onreadystatechange = function () {
        if (sendTeamNameXML.readyState == 4 && sendTeamNameXML.status == 200) {
            // console.log('ok');
        } else if (sendNotificationXML.readyState == 4 && sendNotificationXML.status == 401) {
            window.alert("[ERROR] - sendTeamName: " + sendNotificationXML.status + " - please re login!");
        } else if (sendTeamNameXML.readyState == 4) {
            window.alert("[ERROR] - sendTeamName: " + sendNotificationXML.status);
        }
    }
    var host = document.getElementById("host").innerHTML;
    sendTeamNameXML.open("POST", host + "/request/postTeamName", true);
    var params = "teamName=" + teamName;
    sendTeamNameXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendTeamNameXML.setRequestHeader("Content-length", params.length);
    sendTeamNameXML.send(params);
}

getTeamName();