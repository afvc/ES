"use strict";

var url_git = "https://git.dei.uc.pt/api/v3/projects";
var private_token;
var project_id;

(function()
{	
	window.addEventListener("load", main);
}());


function  main() {
	var table = document.getElementById("tabela_commits");
	table.innerHTML = "";

	document.getElementById("main").style.marginLeft= "0";

	private_token = document.getElementById("token").innerHTML;

	project_id = document.getElementById("projectID").innerHTML;
	get_commits(project_id);
}


function get_projetos_commits (ev) {
	var table = document.getElementById("tabela_commits");
	table.innerHTML = "";

	document.getElementById("main").style.marginLeft= "0";

	/*var token = "?private_token=";

	var url = url_git + token + private_token;

	var pedido = new XMLHttpRequest();
	var metodo = "GET";

	pedido.open(metodo, url, true);
	pedido.setRequestHeader('PRIVATE-TOKEN', private_token);

	pedido.onreadystatechange = function () {
		if(pedido.readyState == XMLHttpRequest.DONE && pedido.status == 200) {
			var array = JSON.parse(pedido.responseText);
			get_ids1(array);
		}
	};
	pedido.send();*/
	get_commits(project_id);
}

function get_ids1(array) {
	var i;
	
	for(i = 0; i < array.length; i++) {
		var id = array[i]['id'];
		get_commits(id) ;
	}
}


function get_commits(id){

	var metodo = "GET";
	var url = url_git + "/" + id + "/repository/commits";

	var pedido = new XMLHttpRequest();
	pedido.open(metodo, url, true);
	pedido.setRequestHeader('PRIVATE-TOKEN', private_token);

	pedido.onreadystatechange = function () {
		if(pedido.readyState == XMLHttpRequest.DONE && pedido.status == 200){
			var array = JSON.parse(pedido.responseText);
			
			how_many(array);
		}
	}
	pedido.send();
}

var a=[];
var b=[];

function how_many(array) {
	
	var j=0;
	var index=0;
	var count=1;
	for (var i = 0; i < array.length; i++) {
		var prev = array[j]['created_at'];
		prev = prev.split("T")[0];
		var compare = array[i]['created_at'].split("T")[0];
		if (compare == prev) {
			a[index] = array[i]['created_at'].split("T")[0];
			if(i != 0){
				count++;	
			}
			if((i == (array.length-1))){
				b.push(count);
			}
		}
		else {
			b.push(count);
			index++;
			a[index] = array[i]['created_at'].split("T")[0];
			j=i+1;
			count=1;
		}
	}
	tentativa(array);
}

function tentativa(array){
	
	var titulo = document.getElementById("titulo");
	titulo.style.display = "block";
	titulo.innerHTML = "Commits"

	var elemento = document.getElementById("listagem");
	
	var grafico = document.getElementById("icon_grafico");
	grafico.style.display = "block";
	grafico.addEventListener("click",commits_grafico);

	var lista = document.getElementById("icon_lista");
	lista.style.display = "none";

	var btn1 = document.getElementById("p1");
	btn1.style.display = "none";

	var table = document.getElementById("tabela_commits");
	table.innerHTML = "";
	table.style.display = "block";
	
	while (elemento.firstChild) {
		elemento.removeChild(elemento.firstChild);
	}

	var aux = 0;
	var linha_aux = 0;
	for(var i=0; i<a.length; i++){
		var date = a[i];
		
		var linha = table.insertRow(linha_aux);
		
		var celula = linha.insertCell(0);
		celula.rowSpan = b[i]+1;
		var celula2 = linha.insertCell(1);
		celula2.rowSpan = b[i]+1;

		celula.innerHTML = a[i];
		celula2.innerHTML = b[i];

		for(var j=0; j<b[i]; j++){
			
			if(j == 0){
				linha_aux++;
				var linha = table.insertRow(linha_aux);

				var celula3 = linha.insertCell(0);
				var celula4 = linha.insertCell(1);
				var celula5 = linha.insertCell(2);
				
				
				celula3.innerHTML = array[aux]['short_id'];
				celula4.innerHTML = array[aux]['message'];
				celula5.innerHTML = array[aux]['author_name'];

				linha_aux++;
	
			}
			else{
				var linha = table.insertRow(linha_aux);

				var celula6 = linha.insertCell(0);
				var celula7 = linha.insertCell(1);
				var celula8 = linha.insertCell(2);

				celula6.innerHTML = array[aux]['short_id'];
				celula7.innerHTML = array[aux]['message'];
				celula8.innerHTML = array[aux]['author_name'];

				linha_aux++;
			}
			aux++;
		}
	}

}

function commits_grafico(ev) {
	document.getElementById("main").style.marginLeft= "0";

	var btn1 = document.getElementById("p1");
	btn1.style.display = "block";

	var table = document.getElementById("tabela_commits");
	table.innerHTML = "";
	table.style.display = "none";

	var grafico = document.getElementById("icon_grafico");
	grafico.style.display = "none";
	var lista = document.getElementById("icon_lista");
	lista.style.display = "block";
	lista.addEventListener("click",get_projetos_commits);

	var c1 = document.getElementById("c1");
	var parent = document.getElementById("p1");
	c1.width = 800;
	c1.height = 350;

	var data = {
		labels : a,

		datasets : [
			{
				fillColor : "rgba(0,0,0,.1)",
				strokeColor : "rgba(0,0,0,1)",
				pointColor : "#123",
				pointStrokeColor : "rgba(0,0,0,1)",
				data : b
			}
		]
	}

	var options = {
		scaleFontColor : "rgba(0,0,0,1)",
		scaleLineColor : "rgba(0,0,0,1)",
		scaleGridLineColor : "transparent",
		bezierCurve : false,
		scaleOverride : true,
		scaleSteps : 3,
		scaleStepWidth : 5,
		scaleStartValue : 0
	}

	new Chart(c1.getContext("2d")).Line(data,options)
}