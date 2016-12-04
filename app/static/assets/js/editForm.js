var editSkype = document.getElementById("editSkype");
var editLinkedIn = document.getElementById("editLinkedIn");
var editTwitter = document.getElementById("editTwitter");
var editWebsite = document.getElementById("editWebsite");
var editBio = document.getElementById("editBio");

function startEdit() {
    if (document.getElementById('radioSync').checked) {
        editLock()
    }

    document.getElementById('radioSync').onclick = editLock;
    document.getElementById('radioNoSync').onclick = editUnlock;
}

function editLock() {
    editSkype.readOnly = true;
    editSkype.style.backgroundColor = '#f0f0f0';
    editLinkedIn.readOnly = true;
    editLinkedIn.style.backgroundColor = '#f0f0f0';
    editTwitter.readOnly = true;
    editTwitter.style.backgroundColor = '#f0f0f0';
    editWebsite.readOnly = true;
    editWebsite.style.backgroundColor = '#f0f0f0';
    editBio.readOnly = true;
    editBio.style.backgroundColor = '#f0f0f0';
}



function editUnlock() {
    editSkype.readOnly = false;
    editSkype.style.backgroundColor = '#ffffff';
    editLinkedIn.readOnly = false;
    editLinkedIn.style.backgroundColor = '#ffffff';
    editTwitter.readOnly = false;
    editTwitter.style.backgroundColor = '#ffffff';
    editWebsite.readOnly = false;
    editWebsite.style.backgroundColor = '#ffffff';
    editBio.readOnly = false;
    editBio.style.backgroundColor = '#ffffff';
}

startEdit();