//This script will be used by the chrome extension
window.onload = function() {
    document.getElementById("settings").addEventListener("click", () => {
        const username = prompt("Username:", "");
        if (username != null) {
            localStorage.setItem("username", username)
        }
        const password = prompt("Password:", "");
        if (password != null) {
            localStorage.setItem("password", password)
        }

    });

    if(!localStorage.getItem("username") || !localStorage.getItem("password")) {
        document.getElementById("loader").remove();
        const warning = document.createElement("p");
        warning.textContent = "Please enter your credentials in the settings.";
        document.body.appendChild(warning);
        
    }
}

function setGrades(grades) {
    const results = document.getElementById("results");
    const iframe = document.getElementById('remote');
    const loader = document.getElementById("loader");
    if(loader) loader.remove();
    if(iframe) iframe.remove();
    for(let i = 0; i < grades.length; i++) {
        const current = grades[i];
        var div = document.createElement('div');
        div.innerHTML = current.subject + ": <b>" + current.number + current.denominator + "</b> " + current.date;
        div.setAttribute('class', 'note');
        results.appendChild(div);
    }
}
chrome.extension.onMessageExternal.addListener(function(data, sender, sendResponse) {
    if(data.grades) {
        setGrades(data.grades);
    }
    if(data.method === "getUsername") {
        sendResponse(localStorage.getItem("username"));        
    }
    if(data.method === "getPassword") {
        sendResponse(localStorage.getItem("password"));        
    }
});
