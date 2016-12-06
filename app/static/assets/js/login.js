var host = 'https://git.dei.uc.pt/api/v3';
var username = 'mantonio';
var pass;
var private_token = 'xbbpsDEhFE62U3Pni7fW';
var name = 'Miguel Antonio Duarte Machado';
var avatar_url = 'https://git.dei.uc.pt//uploads/user/avatar/4723/pika.jpg';
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
			window.location.href = 'index.html';
		}
		else if (xml.readyState == 4) {
			JsonObject = JSON.parse(xml.responseText);
			window.alert('sessionStart: ' + JsonObject.message);
		}
	}
	username = document.getElementById('username').value;
	pass = document.getElementById('password').value;
	xml.open('POST', host + '/session?login=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(pass), true);
	xml.send();
}

function LoginPT() {
	xmlStart();
	xml.onreadystatechange = function () {
		if (xml.readyState == 4 && xml.status == 200) {
			setStorage();
			window.location.href = 'index.html';
		}
		else if (xml.readyState == 4) {
			JsonObject = JSON.parse(xml.responseText);
			window.alert('LoginPT: ' + JsonObject.message);
		}
	}
	xml.open('GET', host + '/projects', true);
	xml.setRequestHeader('PRIVATE-TOKEN', private_token);
	xml.send();
}

function setStorage() {
  //sessionStorage.setItem('user_url', user_url);
	sessionStorage.setItem('username', username);
	sessionStorage.setItem('name', name);
	sessionStorage.setItem('avatar_url', avatar_url);
	sessionStorage.setItem('private_token', private_token);
}
