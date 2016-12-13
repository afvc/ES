"use strict";

(function()
{	
	window.addEventListener("load", main);
}());

//Preenche a deadline, impacto e probabilidade do risco consoante a célula selecionada
function configurate() {
	var typeRisk = localStorage.getItem("typeRisk");
	if(typeRisk != null){
		switch (typeRisk){
			case "pos20":
				document.getElementById("ILow").checked = true;
				document.getElementById("PLow").checked = true;
				break;
			case "pos10":
				document.getElementById("ILow").checked = true;
				document.getElementById("PMedium").checked = true;
				break;
			case "pos00":
				document.getElementById("ILow").checked = true;
				document.getElementById("PHigh").checked = true;
				break;
			case "pos21":
				document.getElementById("IMedium").checked = true;
				document.getElementById("PLow").checked = true;
				break;
			case "pos11":
				document.getElementById("IMedium").checked = true;
				document.getElementById("PMedium").checked = true;
				break;
			case "pos01":
				document.getElementById("IMedium").checked = true;
				document.getElementById("PHigh").checked = true;
				break;
			case "pos22":
				document.getElementById("IHigh").checked = true;
				document.getElementById("PLow").checked = true;
				break;
			case "pos12":
				document.getElementById("IHigh").checked = true;
				document.getElementById("PMedium").checked = true;
				break;
			case "pos02":
				document.getElementById("IHigh").checked = true;
				document.getElementById("PHigh").checked = true;
				break;
		}
	}

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
	document.getElementById("riskDeadline").value = today;
}

function main() {
	//Configurações consoante a célula selecionada
	configurate();

	//Colocar com a formatação inicial a cada alteração
	document.getElementById("DescriptionText").addEventListener("focus",changeDescription);

	document.getElementById("riskDeadline").addEventListener('change', changeDeadline);

	document.getElementById("ILow").addEventListener("change",changeImpact);
	document.getElementById("IMedium").addEventListener("change",changeImpact);
	document.getElementById("IHigh").addEventListener("change",changeImpact);

	document.getElementById("PLow").addEventListener("change",changeProbability);
	document.getElementById("PMedium").addEventListener("change",changeProbability);
	document.getElementById("PHigh").addEventListener("change",changeProbability);

	//Clicar guardar
	document.getElementById("save").addEventListener("click",save);
}

//Variável auxiliar para guardar a deadline atual
var auxiliar = {};
auxiliar.riscoDeadline = "";

//Verificação em cada alteração da deadline
function changeDeadline(ev) {
	//Estilo inicial
	document.getElementById('Deadline').style.border = "none";	
	//Verificar se houve alteração na deadline
	if (this.value != auxiliar.riscoDeadline) {
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
		//Atualizar variável auxiliar com a deadline inserida
		auxiliar.riscoDeadline = this.value;
	}
}		

function adjustTextArea(h) {
	h.style.height = "20px";
	h.style.height = (h.scrollHeight)+"px";
}

//Função para guardar o risco inserido
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
		var arrayRisks;

		sendNotificationInsertRisk(descriptionValue,impactValue,probabilityValue);

		document.getElementById('insertRisk').click();

		document.getElementById("insert").style.display = "none";
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

function sendNotificationInsertRisk(description, impact,probability) {
	if((impact == "IMedium" && probability == "PHigh") || (impact == "IHigh" && (probability == "PHigh" || probability == "PMedium"))){
		alert("Foi criado um risco considerado 'alto'!");
		sendNotification("Foi criado um risco considerado 'alto'!",1,"Risks");
	}
	else{
		console.log("Um risco foi criado");
		sendNotification("Um risco foi criado",0,"Risks");
	}
}