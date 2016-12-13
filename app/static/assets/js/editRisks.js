"use strict";

(function()
{	
	window.addEventListener("load", main1);
	
}());

function main1() {
	riskXMLStart();
	getRisk();
}
function main(description,deadline,impact,probability) {
	document.getElementById("DescriptionText").value = description;
	document.getElementById("riskDeadline").value = deadline;
	document.getElementById(impact).checked = true;
	document.getElementById(probability).checked = true;

	var today = new Date();
	var dd = today.getDate()+1;
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd
	} 
	if(mm<10){
		mm='0'+mm
	} 

	today = yyyy + '-' + mm + '-' + dd;

	document.getElementById("riskDeadline").setAttribute("min", today);

	document.getElementById("riskDeadline").addEventListener('change', changeDeadline);

	document.getElementById("ILow").addEventListener("change",changeImpact);
	document.getElementById("IMedium").addEventListener("change",changeImpact);
	document.getElementById("IHigh").addEventListener("change",changeImpact);

	document.getElementById("PLow").addEventListener("change",changeProbability);
	document.getElementById("PMedium").addEventListener("change",changeProbability);
	document.getElementById("PHigh").addEventListener("change",changeProbability);

	document.getElementById("DescriptionText").addEventListener("focus",changeDescription);

	document.getElementById("save").addEventListener("click",save);
	document.getElementById("remove").addEventListener("click",confirme);
}

var aux = {};
aux.riskDeadline = "";

function changeDeadline(ev) {
	//Estilo inicial
	document.getElementById('Deadline').style.border = "none";	
	//Verificar se houve alteração na deadline
	if (this.value != aux.riskDeadline) {
		var deadlineInserted = new Date(document.getElementById("riskDeadline").value);
		var today = new Date();
		//Verificar se a deadline inserida é superior à data atual
		if(today > deadlineInserted)
		{
			this.style.borderColor = "red";
		}
		else{
			this.style.borderColor = "#ddd";		
		}
		//Atualizar variável aux com a deadline inserida
		aux.riskDeadline = this.value;
	}
}	

function adjustTextArea(h) {
	h.style.height = "20px";
	h.style.height = (h.scrollHeight)+"px";
}


//Guardar a editação
function save(ev) {
	var errorDescription = false;
	var errorDeadline = false;
	var errorRadio = true;

	var description = document.getElementById("Description");
	var descriptionValue = document.getElementById("DescriptionText").value;
	if (descriptionValue == "" || descriptionValue.trim().length == 0) {
		errorDescription = true;
		description.style.border = "1px solid red";
	}

	var deadline = document.getElementById("Deadline");
	var deadlineValue = document.getElementById("riskDeadline").value;

	var deadlineInserted = new Date(deadlineValue);
	var today = new Date();
	//Verificar se a deadline inserida é superior à data atual
	if (deadlineValue == "" || today >= deadlineInserted) {
		errorDeadline = true;
		deadline.style.border = "1px solid red";
	}
	var radioButtons = document.getElementsByName('ImpactRadio');

	for (var i = 0, length = radioButtons.length; i < length; i++) {
		if (radioButtons[i].checked) {
			errorRadio = false;
			var impactValue = radioButtons[i].value;
			break;
		}
	}

	if (errorRadio) {
		document.getElementById('Impact').style.border = "1px solid red";
	}

	var errorRadio2 = true;

	radioButtons = document.getElementsByName('ProbabilityRadio');

	for (var i = 0, length = radioButtons.length; i < length; i++) {
		if (radioButtons[i].checked) {
			errorRadio2 = false;
			var probabilityValue = radioButtons[i].value;
			break;
		}
	}

	if (errorRadio2) {
		document.getElementById('Probability').style.border = "1px solid red";
	}

	if (errorDescription == false && errorDeadline == false && errorRadio == false && errorRadio2 == false) {
		sendNotificationRisk(descriptionValue,impactValue,probabilityValue);
		document.getElementById('editRisk').click();

		document.getElementById("edit").style.display = "none";
	}
}

function changeImpact(ev) {
	document.getElementById('Impact').style.border = "none";	
}

function changeProbability(ev) {
	document.getElementById('Probability').style.border = "none";	
}

function changeDescription(ev) {
	document.getElementById('Description').style.border = "none";	
}

//Confirmar a remoção
function confirme(ev){
	document.getElementById("message").innerHTML = "Are you sure?";
    document.getElementById("removed").style.display = 'block';

    document.getElementById("yes").addEventListener("click",removeRisk);
	document.getElementById("no").addEventListener("click",removeRisk);
}

//Remover risco
function removeRisk(ev) {
	if (ev.target.id == "yes") {
		var arrayRisks = JSON.parse(localStorage.getItem("risks"));

		var selecionado = document.getElementById("idRisk").value;

		for (var i = 0; i < riskJsonObject.length; i++) {
			if(riskJsonObject[i].id_risk == selecionado){
				document.getElementById('saveRemove').value = "Remove";
				document.getElementById('editRisk').click();
			}
		}
	}
	else{
		window.location.href = "/indexRisks.html";	
	}
    document.getElementById("removed").style.display = 'none';
    sendNotificationRisk(-1,-1,-1);
}

function sendNotificationRisk(description, impact,probability) {
	if((impact == "IMedium" && probability == "PHigh") || (impact == "IHigh" && (probability == "PHigh" || probability == "PMedium"))){
		alert("Foi alterado um risco para um estado considerado 'alto'!");
		sendNotification("Foi alterado um risco para um estado considerado 'alto'!",1,"Risks");
	}
	else if(description == -1 && impact == -1 && probability == -1){
		console.log("Um risco foi fechado/removido");
		sendNotification("Um risco foi fechado/removido",0,"Risks");
	}
	else{
		console.log("Um risco foi alterado");
		sendNotification("Um risco foi alterado",0,"Risks");
	}
}

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
    var risk = localStorage.getItem("risk");
    document.getElementById("idRisk").value = risk;
    console.log(risk);
    for (var i = 0; i < riskJsonObject.length; i++) {
        if(riskJsonObject[i].id_risk == risk){
        	main(riskJsonObject[i].description,riskJsonObject[i].deadline,riskJsonObject[i].impact,riskJsonObject[i].probability);	
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

function sendRisk(idRisk) {
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

    sendRiskUpdate.open("POST", host + "/request/postRisk/projectID=" + projectID + "&id_risk=" + idRisk, true); // A project must be select | A user must be logged in | Sends notification to all users of selected project
    sendRiskUpdate.send();
}