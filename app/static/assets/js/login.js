var host = "https://git.dei.uc.pt/api/v3";
var username = "ivoc";
var pass;
var private_token = "euGeZsHMUnMES6pVQE1f";
var name = "Ivo Ferreira Carvalho";
var avatar_url = "https://git.dei.uc.pt//uploads/user/avatar/4723/pika.jpg";
var user_url;
var xml;

function xmlStart() {
	if (window.XMLHttpRequest) {
		xml = new XMLHttpRequest();
	}
	//code for IE6, IE5
	else {
		xml = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function sessionStart() {
	xmlStart();
	var JsonObject;
	xml.onreadystatechange = function () {
		if (xml.readyState == 4 && xml.status == 201) {
			JsonObject = JSON.parse(xml.responseText);
			console.log(JsonObject);
			private_token = JsonObject.private_token;
			name = JsonObject.name;
			avatar_url = JsonObject.avatar_url;
			setStorage();
			window.location.href = "index.html";
		}
		else if (xml.readyState == 4) {
			JsonObject = JSON.parse(xml.responseText);
			window.alert("sessionStart: " + JsonObject.message);
		}
	}
	username = document.getElementById("uname").value;
	pass = document.getElementById("psw").value;
	xml.open("POST", host + "/session?login=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(pass), true);
	xml.send();
}

function setStorage() {
	sessionStorage.setItem("user_url", user_url);
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("name", name);
	sessionStorage.setItem("avatar_url", avatar_url);
	sessionStorage.setItem("private_token", private_token);
}