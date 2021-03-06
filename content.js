//This script will be executed on Pronote itself

console.info("Pronote extension loaded.");
const DELAY = 1500; //Delay to use Pronote cause it sucks
const ID = "mhiecmjfcjelhgccnenmhehllfehkalh"; //Extension ID

let credentials = {};
chrome.runtime.sendMessage(ID, {method: "getUsername"}, function(data) {
    credentials.username = data;
});
chrome.runtime.sendMessage(ID, {method: "getPassword"}, function(data) {
    credentials.password = data;
});

/* My scraping function */
function scrapeData() {
    const grades = [];
    // Pronote's code actually changes overtime so I used a workaround : [23]
    const currentId = document.getElementById("GInterface.Instances[1]_colonne_1").childNodes[1].id;
    const latestGrades = document.getElementById(currentId + "_suffContent").childNodes;
    for(let i = 0; i < latestGrades.length; i++) {
        const gradeObject = latestGrades[i];
        /* 
            What
            The
            Fuck
            Pronote
        */
        const gradeSubject = gradeObject.childNodes[0].childNodes[1].childNodes[0].innerText; 
        const grade = gradeObject.childNodes[0].childNodes[3].childNodes[0].textContent;
        let gradeDenominator = '';
        if(gradeObject.childNodes[0].childNodes[3].childNodes[1]) {
            gradeDenominator = gradeObject.childNodes[0].childNodes[3].childNodes[1].innerText
        }
        const gradeDate = gradeObject.childNodes[1].childNodes[0].childNodes[0].textContent;
        const finalGrade = {
            number: grade,
            subject: gradeSubject,
            denominator: gradeDenominator,
            date: gradeDate
        }
        grades.push(finalGrade);
    }
    chrome.runtime.sendMessage(ID, {grades}); //send back the grades to the chrome extension
}

waitForElementToDisplay("GInterface.Instances[0]", 100, () => { //wait for page to load
    const username = document.getElementById("GInterface.Instances[0].idIdentification.bouton_Edit");
    const password = document.getElementById("GInterface.Instances[0]_password");
    if(username && password) {
        /* Setting credentials on front-end */
        username.value = credentials.username;
        password.value = credentials.password;
        
        /* Setting username in the code not in front-end */
        GInterface.Instances[0].contenuIdent = credentials.username;
        /* Starting authentication with delay cause Pronote sucks */
        setTimeout(function() {
            loginBtn();
        }, 50);
    }
    waitForElementToDisplay("GInterface.Instances[1]_colonne_1", 100, scrapeData);        
});

function loginBtn() {
    /* Initiate authentication function provided by Pronote */
    GInterface.Instances[0].evenementSurBtnConnexion();
}

function waitForElementToDisplay(selector, time, cb) {
    if(document.getElementById(selector) != null) {
        cb();
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time, cb);
        }, time);
    }
}