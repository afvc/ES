"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main() {

	var pos20 = document.getElementById("pos20");
	var pos10 = document.getElementById("pos10");
	var pos00 = document.getElementById("pos00");
	var pos21 = document.getElementById("pos21");
	var pos11 = document.getElementById("pos11");
	var pos01 = document.getElementById("pos01");
	var pos22 = document.getElementById("pos22");
	var pos12 = document.getElementById("pos12");
	var pos02 = document.getElementById("pos02");

	pos20.addEventListener("click",insert);
	pos10.addEventListener("click",insert);
	pos00.addEventListener("click",insert);
	pos21.addEventListener("click",insert);
	pos11.addEventListener("click",insert);
	pos01.addEventListener("click",insert);
	pos22.addEventListener("click",insert);
	pos12.addEventListener("click",insert);
	pos02.addEventListener("click",insert);	
}

function myTimer() {
	var today = new Date();
	var tomorrow;
	
	var dd = today.getDate();
	var dd1 = today.getDate()+1;
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd
	} 
	if(dd1<10){
		dd1='0'+dd1
	} 
	if(mm<10){
		mm='0'+mm
	} 

	today = yyyy + '-' + mm + '-' + dd;
	tomorrow = yyyy + '-' + mm + '-' + dd1;

	for (var i = 1; i < riskJsonObject.length; i++) {
    	if(riskJsonObject[i].deadline < today){
			sendRisk(riskJsonObject[i].id_risk);
			location.reload();
    	}
    	else if(riskJsonObject[i].deadline == today || riskJsonObject[i].deadline == tomorrow){
    		console.log("A deadline do Risco: " + riskJsonObject[i].description + " é dia: " + riskJsonObject[i].deadline + "!");
    	}
    }    
}

var sendRiskUpdate;

function sendRiskUpdateStart() {
    if (window.XMLHttpRequest) {
        sendRiskUpdate = new XMLHttpRequest();
    } else {
        sendRiskUpdate = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendRisk(isRisk) {
    sendRiskUpdateStart();
    sendRiskUpdate.onreadystatechange = function () {
        if (sendRiskUpdate.readyState == 4 && sendRiskUpdate.status == 200) {
            
        } else if (sendRiskUpdate.readyState == 4 && sendRiskUpdate.status == 401) {
            //window.alert("[ERROR] - postNotification: " + sendRiskUpdate.status + " - please re login!");
        } else if (sendRiskUpdate.readyState == 4) {
            //window.alert("[ERROR] - postNotification: " + sendRiskUpdate.status);
        }
    }

    var host = document.getElementById("host").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;

    sendRiskUpdate.open("POST", host + "/request/postRisk", true); // A project must be select | A user must be logged in | Sends notification to all users of selected project
    var params = "projectID=" + projectID + "&id_risk=" + idRisk;
    sendRiskUpdate.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendRiskUpdate.setRequestHeader("Content-length", params.length);
    sendRiskUpdate.send(params);
}

function insert(ev) {
	localStorage.setItem("typeRisk",ev.currentTarget.id);
	window.location.href = "/insertRisks.html";
}

function editRisk(risk) {
	localStorage.setItem("risk",risk);
}

function showRisk(idRisk,description,deadline,impact,probability) {
	var showRiskText = document.getElementById("box");

	showRiskText.innerHTML = "ID: " + idRisk + "<br>Risk: " + description + "<br>Deadline: " + deadline + "<br>Impact: " + impact.substring(1) + "<br>Probability: " + probability.substring(1);

	showRiskText.style.display = "block";
}

function hideRisk(ev) {
	document.getElementById("box").style.display = "none";
}

//----------------------------COM BD--------------------------------//

var riskXML;
var riskJsonObject;

function riskXMLStart() {
    if (window.XMLHttpRequest) {
        riskXML = new XMLHttpRequest();
    } else {
        riskXML = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function getRisk() {
    riskXML.onreadystatechange = function () {
        if (riskXML.readyState == 4 && riskXML.status == 200) {
            riskJsonObject = JSON.parse(riskXML.responseText);
            //console.log(riskJsonObject);
            myTimer();
            fillRisks();

        } else if (riskXML.readyState == 4) {
            riskJsonObject = JSON.parse(riskXML.responseText);
            //window.alert(riskXML.status + " - getRisk: " + riskJsonObject.message);
        }
    }
    console.log(window.location.host)
    var host = document.getElementById("host").innerHTML;
    var projectID = document.getElementById("projectID").innerHTML;
    var username = document.getElementById("username").innerHTML;
    riskXML.open("GET", host + "/request/getRisk/" + username + "/" + projectID, true);
    riskXML.send();
}

function fillRisks() {
    var projectID = document.getElementById("projectID").innerHTML;

    for (var i = 0; i < riskJsonObject.length; i++) {
        if(riskJsonObject[i].project == projectID && riskJsonObject[i].status == 1){
        	fillRisk(riskJsonObject[i].id_risk,riskJsonObject[i].description,riskJsonObject[i].deadline,riskJsonObject[i].impact,riskJsonObject[i].probability);	
        }
    }
}

riskXMLStart();
getRisk();


function fillRisk(idRisk,description,deadline,impact,probability) {
	var content = document.getElementsByClassName("content");
	var aux;
	var opt;
	var showRiskText = document.getElementById("box");
	opt = document.createElement('A');
	opt.id = idRisk;
	opt.innerHTML = idRisk + ": " + description + "<br>";
	opt.href = "/editRisks.html";
	opt.addEventListener("mouseover",showRiskEvent);
	opt.addEventListener("click",editRiskEvent);
	function showRiskEvent(ev) {
		showRisk(idRisk, description,deadline,impact,probability);
	}
	function editRiskEvent(ev) {
		editRisk(ev.target.id);

	}
	opt.addEventListener("mouseout",hideRisk);
	if(impact == "ILow"){
		if(probability == "PLow"){
			aux = pos20;
			aux.className = "";
			aux.className = "green";
			
			content[6].appendChild(opt);
		}
		else if(probability == "PMedium"){
			aux = pos10;
			aux.className = "";
			aux.className = "green";

			content[3].appendChild(opt);
		}
		else if(probability == "PHigh"){
			aux = pos00;
			aux.className = "";
			aux.className = "yellow";
			 
			content[0].appendChild(opt);
		}
	}
	else if(impact == "IMedium"){
		if(probability == "PLow"){
			aux = pos21;
			aux.className = "";
			aux.className = "green";
							
			content[7].appendChild(opt);
		}
		else if(probability == "PMedium"){
			aux = pos11;
			aux.className = "";
			aux.className = "yellow";
			
			content[4].appendChild(opt);
		}
		else if(probability == "PHigh"){
			aux = pos01;
			aux.className = "";
			aux.className = "red";
			
			content[1].appendChild(opt);
		}	
	}
	else if(impact == "IHigh"){
		if(probability == "PLow"){
			aux = pos22;
			aux.className = "";
			aux.className = "yellow";
			
			content[8].appendChild(opt);
		}
		else if(probability == "PMedium"){
			aux = pos12;
			aux.className = "";
			aux.className = "red";
			
			content[5].appendChild(opt);
		}
		else if(probability == "PHigh"){
			aux = pos02;
			aux.className = "";
			aux.className = "red";
							
			content[2].appendChild(opt);
		}
	}	
}