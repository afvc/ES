function xmlStart() {
	if (window.XMLHttpRequest) {
		xml = new XMLHttpRequest();
	}
	//code for IE6, IE5
	else {
		xml = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function getProjects() {
	xmlStart();
	xml.onreadystatechange = function () {
		if (xml.readyState == 4 && xml.status == 200) {
			JsonObject = JSON.parse(xml.responseText);
			createProjects();
		}
		else if (xml.readyState == 4) {
			JsonObject = JSON.parse(xml.responseText);
			window.alert("getProjects: " + JsonObject.message);
		}
	}
	xml.open("GET", host + "/projects", true);
	xml.setRequestHeader('PRIVATE-TOKEN', private_token);
	xml.send();
}

function lol(){
	sessionStorage.setItem("project_id", $(this).find("p").html().split(" - ")[0]);
	sessionStorage.setItem("project_name", $(this).find("p").html().split(" - ")[1]);
	document.getElementById("project").innerHTML = $(this).find("p").html().split(" - ")[1];
	project_name = sessionStorage.getItem("project_name");
	project_id = sessionStorage.getItem("project_id");
	setRoleOnSession();
	//window.location.href = "home.html";
}

function createProjects() {
	for (var i = 0; i < JsonObject.length; i++) {
		var proj = document.createElement("div");
		var li = document.createElement("li");
		var btn = document.createElement("p");
		var txt = document.createElement("p");
		var description = document.createElement("p");
		var last_act = document.createElement("p");

		txt.innerHTML = JsonObject[i].id + " - " + JsonObject[i].name;
		description.innerHTML = JsonObject[i].description;
		last_act.innerHTML = "Last Activity: " + convertISO8601toDate(JsonObject[i].last_activity_at);
		btn.onclick = function (){
		sessionStorage.setItem("project_id", $(this).find("p").html().split(" - ")[0]);
		sessionStorage.setItem("project_name", $(this).find("p").html().split(" - ")[1]);
		document.getElementById("project").innerHTML = $(this).find("p").html().split(" - ")[1];
		project_name = sessionStorage.getItem("project_name");
		project_id = sessionStorage.getItem("project_id");
		setRoleOnSession();
		};
		$(txt).css({
			"font-size": "2vw"
			, "margin": "0 0 0"
		});
		$(description).css({
			"font-size": "1.2vw"
			, "margin": "0 0 0"
		});
		proj.appendChild(txt);
		proj.appendChild(description);
		$(last_act).css({
			"margin": "0"
			, "width": "50%"
			, "font-size": "1vw"
			, "right": "0"
			, "bottom": "0"
			, "position": "absolute"
			, "text-align": "right"
		});
		$(proj).css({
			"width": "50%"
			, "text-align": "left"
		});
		btn.appendChild(proj);
		btn.appendChild(last_act);
		$(btn).css({
			"width": "99%"
			, "background-color": "#109877"
			, "border-style": "none"
			, "outline": "0"
			, "display": "flex"
			, "margin": "2px 2px"
			, "position": "relative"
			, "border-bottom": "1px solid grey"
		});
		li.appendChild(btn);
		document.getElementById("list").appendChild(li);
	}
}
/*codigo daqui: https://www.safaribooksonline.com/library/view/javascript-cookbook/9781449390211/ch03s05.html*/
function convertISO8601toDate(dtstr) {
	dtstr = dtstr.replace(/\D/g, " ");
	dtstr = dtstr.replace(/\s+$/, "");
	var dtcomps = dtstr.split(" ");
	if (dtcomps.length < 3) return "invalid date";
	if (dtcomps.length < 4) {
		dtcomps[3] = 0;
		dtcomps[4] = 0;
		dtcomps[5] = 0;
	}
	dtcomps[1]--;
	var convdt = new
	Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
	return convdt.toUTCString();
}
