"use strict";

(function()
{	
	window.addEventListener("load", main);
}());

var url_git = "https://git.dei.uc.pt/api/v3/projects";

var private_token;
var project_id;

function main()
{
	project_id = document.getElementById("projectID").innerHTML;
	private_token = document.getElementById("token").innerHTML;

	var url = url_git + "/" + project_id + "/repository/tree";
	localStorage.setItem("url_root",url);
	
	files(url,0);
}

function files (url,estado) {
	var request = new XMLHttpRequest();
	var method = "GET";
	
	request.open(method, url, true);
	request.setRequestHeader('PRIVATE-TOKEN', private_token);

	request.onreadystatechange = function () {
		
		if(request.readyState == XMLHttpRequest.DONE && request.status == 200){
			var array = JSON.parse(request.responseText);
			if(estado == 0){
				var url_aux = url + "?path=";	
				printFiles(url_aux,array,"");
			}
			else{
				var url_aux = url + "/";
				printFiles(url_aux,array,"");
			}
		}
	};				

	request.send();
}

function printFiles (url1,array,space) {
	localStorage.setItem("currentURL",url1);

	var name = "";
	var i;

	var table = document.getElementById("navigate_files");
	table.innerHTML = "";
	table.style.display = "block";
	
	for(i = 0; i < array.length; i++) {

		var row = table.insertRow(i);
		
		var cell = row.insertCell(-1);

		name = array[i]['name'];

		cell.innerHTML = name;

		row.id = name;
    	
		if(array[i]['type'] == "tree"){
			
			var x=row.insertCell(0);

			var img = document.createElement('img');
			
			img.id = "folder";
			img.src = "static/assets/images/iconPastas.png";
			x.appendChild(img);

			row.style.cursor = "pointer";
			row.className	 = "passed";
			row.addEventListener("click",FilesFolderEvento);

			function FilesFolderEvento(ev) {
				var url = url1 + space + ev.currentTarget.id;
				
				localStorage.setItem("currentURL",url);
				FilesFolder (url,i,name,"");
			}			
		}
		else{
			var x=row.insertCell(0);

			var img = document.createElement('img');
			img.id = "file";
			
			img.src = "static/assets/images/iconFicheiros.png";
			x.appendChild(img);
		}
	}
}

function FilesFolder (url,i,name,space) {
	var backBtn = document.getElementById("back");
	backBtn.style.display = "block";
	backBtn.addEventListener("click",back);

	var table = document.getElementById("navigate_files");
	table.innerHTML = "";
	table.style.display = "block";

	var request = new XMLHttpRequest();
	var method = "GET";
	
	request.open(method, url, true);
	request.setRequestHeader('PRIVATE-TOKEN', private_token);

	request.onreadystatechange = function () {
		
		if(request.readyState == XMLHttpRequest.DONE && request.status == 200){
			var array = JSON.parse(request.responseText);
			printFiles(url,array,"/");
		}
	};				
	request.send();
}

function back(ev) {
	var currentURL = localStorage.getItem("currentURL");
	var url_root = localStorage.getItem("url_root");

	var url_split = currentURL.split("/");
	var lengthURL = url_split.length;
	var lengthURL_root = url_root.split("/").length;
	
	if((lengthURL == lengthURL_root) || (url_split[url_split.length-1] == "")){	
		var backBtn = document.getElementById("back");
		backBtn.style.display = "none";
		backBtn.removeEventListener("click",back);

		files(url_root,0);
	}
	else{
		var url_aux = url_split.slice(0,url_split.length-1).join("/");
		files(url_aux,1);		
	}
}