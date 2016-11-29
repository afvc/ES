var sendTeamNameXML;

function getTeamName() {
    teamName = prompt("Please enter a name for this team! (max 30 chars)");

    if (teamName != null) {
        sendNotification(teamName);
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

function sendNotification(teamName) {
    sendTeamNameXMLStart();
    sendTeamNameXML.onreadystatechange = function () {
        if (sendTeamNameXML.readyState == 4 && sendTeamNameXML.status == 200) {
            // console.log('ok');
        } else if (sendTeamNameXML.readyState == 4) {
            window.alert(sendTeamNameXML.status + " - postTeamName");
        }
    }
    var host = document.getElementById("host").innerHTML;
    var username = document.getElementById("username").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;
    sendTeamNameXML.open("POST", host + "/request/postTeamName", true);
    var params = "username=" + username + "&projectID=" + projectID + "&teamName=" + teamName;
    sendTeamNameXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendTeamNameXML.setRequestHeader("Content-length", params.length);
    sendTeamNameXML.send(params);
}

getTeamName();