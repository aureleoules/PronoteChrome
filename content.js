//This script will be executed on Pronote itself

console.info("Pronote extension loaded.");
const DELAY = 1000; //Delay to use Pronote cause it sucks
const ID = "mhiecmjfcjelhgccnenmhehllfehkalh"; //Extension ID

let credentials = {};
chrome.runtime.sendMessage(ID, {method: "getUsername"}, function(data) {
    credentials.username = data;
});
chrome.runtime.sendMessage(ID, {method: "getPassword"}, function(data) {
    credentials.password = data;
});


setTimeout(function() {
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
            /** Login */
            loginBtn();
            setTimeout(function() {
                /* Let's scrape some data */
                scrapeData();
            }, DELAY);
        }, DELAY);
    } else {
        setTimeout(function() {
            /* If already logged-in -> Scrape data */
            scrapeData();
        }, DELAY);   
    }
}, DELAY);

function loginBtn() {
    /* Initiate authentication function provided by Pronote */
    GInterface.Instances[0].evenementSurBtnConnexion();
}

/* My scraping function */
function scrapeData() {
    const grades = [];
    /** I think this is the worst code I have ever reversed-engineer **/
    // Pronote's code actually changes overtime so I used a workaround : [23]
    const latestGrades = document.getElementsByClassName("AlignementHaut")[23].childNodes[0].childNodes[0].childNodes;
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