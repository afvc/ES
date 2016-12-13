"use strict";

(function () {
	window.addEventListener("load",main);
}());

var user; 
var host = 'https://git.dei.uc.pt/api/v3/projects/';
var private_token;
var branch = "master";
var project_id;
var back;

function main(){
	//window.addEventListener("message", function(){
		//console.log(path);

		user = JSON.parse(localStorage.getItem("user"));
		
		project_id = document.getElementById("projectID").innerHTML;
		private_token = document.getElementById("token").innerHTML;
		
		localStorage.setItem("path", "");
		loadCurrent(project_id);
	//});
}

function loadCurrent(project_id){
	$.get(host+project_id+"/repository/tree", {private_token:private_token, ref_name:branch, path: localStorage.getItem("path")}, function(ev){
		displayFiles(project_id, ev);
	});
}

function displayFiles(id, file_data){
	document.getElementById("main").innerHTML = "";
	/*var img0 = document.createElement("img");
	img0.id = "back";
	img0.style.display = "none";
    img0.height = 30;
	img0.width = 30;
	img0.src = "static/assets/images/back0.png";*/

	/*var p0 = document.createElement("p");
	p0.appendChild(img0);

	document.getElementById("main").appendChild(p0);*/

	var img1 = document.createElement("img");
    img1.height = 30;
	img1.width = 30;
	img1.src = "static/assets/images/path.png";
	var pa = document.createElement("p");
	pa.appendChild(img1);		
	var nod = document.createTextNode("Path: " + localStorage.getItem("path"));
	pa.appendChild(nod);
	document.getElementById("main").appendChild(pa);


	var table = document.createElement("table");
	for(let i=0; i < file_data.length;i++){
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(-1);
		var cell2 = row.insertCell(-1);
		var cell3 = row.insertCell(-1);
		var cell4 = row.insertCell(-1);
		var img = document.createElement("img"); img.height = 30; img.width = 30;
		var p = document.createElement("p");

		if(file_data[i].type == "blob"){
			img.src = "static/assets/images/file.jpg";
			//p.appendChild(img);		
			var node = document.createTextNode(file_data[i].name);
			//p.appendChild(node);
			cell1.appendChild(img);
			cell2.appendChild(node);
			var img2 = document.createElement("img"); img2.height = 30; img2.width = 30; img2.src = "static/assets/images/content.png"; img2.style.cursor = "pointer"; cell3.appendChild(img2);	
			var img3 = document.createElement("img"); img3.height = 30; img3.width = 30; img3.src = "static/assets/images/lifecycle.png"; img3.style.cursor = "pointer"; cell4.appendChild(img3);	
			img2.onclick = function(){
				if(localStorage.getItem("path")==""){
					localStorage.setItem("path", file_data[i].name);
				}
				else{
					localStorage.setItem("path", localStorage.getItem("path")+"/"+file_data[i].name);
				}
				content(id, file_data[i]);
				//content
			}

			img3.onclick = function(){
				lifecycle(id, file_data[i]);
			}
		}
		else if(file_data[i].type == "tree"){
			img.src = "static/assets/images/folder.jpg";
			img.style.cursor = "pointer";
			cell1.appendChild(img);	
			var node = document.createTextNode(file_data[i].name);
			cell2.appendChild(node);
			document.getElementById("main").appendChild(p);
			cell1.onclick = function(){

				if(localStorage.getItem("path")==""){
					var backBtn = document.getElementById("back");
					backBtn.style.display = "block";
					backBtn.addEventListener("click",back);

					localStorage.setItem("path", file_data[i].name);
					loadCurrent(id);
				}
				else{				
					localStorage.setItem("path", localStorage.getItem("path")+"/"+file_data[i].name);
					loadCurrent(id);
				}
			}
		}
	}
	document.getElementById("main").appendChild(table);
}

function lifecycle(project_id,file){
	document.getElementById("main").innerHTML = "";

	$.get(host+project_id+"/repository/commits", {private_token:private_token, ref_name:branch}, function(eve){

		//Lifecycle table
		var table = document.createElement("table");
		var row = table.insertRow(0);
		var data = ["Title","Author","Author Email", "Creation Date", "Message"];
		for(let aux = 0; aux < 5; aux ++)
			var cell = row.insertCell(-1).innerHTML = data[aux]; 
		
		var c = 1;		
		var commitpath = file.name;
			if(localStorage.getItem("path")!="")
				commitpath = localStorage.getItem("path") + "/" + commitpath;
		
		for (let j = 0 ; j < eve.length ; j++){
		
			$.get(host+project_id+"/repository/commits/"+eve[j].id+"/diff", {private_token:private_token, ref_name:branch}, function(ev1){	

				if (ev1[0].new_path == commitpath){
					var row = table.insertRow(c);
					c+=1;
					var datab = [eve[j].title,eve[j].author_name,eve[j].author_email, eve[j].created_at, eve[j].message];
					for(let aux = 0; aux < 5; aux ++)
						var cell = row.insertCell(-1).innerHTML = datab[aux]; 
				}
			});
		}
		document.getElementById("main").appendChild(table);
	if(localStorage.getItem("path")==""){
		localStorage.setItem("path", file.name);
	}
	else{
		localStorage.setItem("path", localStorage.getItem("path")+"/"+file.name);
	}
	});
	var backBtn = document.getElementById("back");
	backBtn.style.display = "block";
	backBtn.addEventListener("click",back);

}

function content(project_id,file){
	document.getElementById("main").innerHTML = "";
	$.get(host+project_id+"/repository/files", {file_path: localStorage.getItem("path"), ref:branch, private_token: private_token}, function(ev){
		var par = document.createElement("p");
		var node = document.createTextNode(atob(ev.content)); 
		document.getElementById("main").appendChild(node);
	});
	var backBtn = document.getElementById("back");
	backBtn.style.display = "block";
	backBtn.addEventListener("click",back);
}




function back(ev) {
	console.log("sou back");
	if(localStorage.getItem("path").indexOf('/') == -1){
		localStorage.setItem("path", "");
		/*frame.src = "lifecycle.html";
		frame.onload = function(){
			frame.contentWindow.postMessage("", "*");
		}*/
		var backBtn = document.getElementById("back");
		backBtn.style.display = "none";
		backBtn.removeEventListener("click",back);
		console.log("uoi");
		loadCurrent(project_id);
	}
	else{
		console.log("assdf");
		var subpath = localStorage.getItem("path").split("/");
		var subsub = "";
		for(let i = 0; i < subpath.length - 1; i++)
			subsub = subsub.concat(subpath[i]+"/");
		
		subsub = subsub.substring(0, subsub.length - 1);
		localStorage.setItem("path", subsub);
		/*frame.src = "lifecycle.html";
		frame.onload = function(){
			frame.contentWindow.postMessage("", "*");
		}*/
		console.log("asdfsdf");
		loadCurrent(project_id);
	}
}