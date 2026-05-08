
var mathQ = [
    "Is 15 + 15 equal to 30?",
    "Is Pi exactly 3.14?",
    "Is a triangle a polygon with 4 sides?",
    "Does 10 * 10 equal 100?",
    "Is 2 an even number?"
];
var mathA = ["True", "False", "False", "True", "True"];

var engQ = [
    "Is a noun a naming word?",
    "Is 'quickly' a verb?",
    "Do sentences start with a capital letter?",
    "Is 'apple' an adjective?",
    "Is 'he' a pronoun?"
];
var engA = ["True", "False", "True", "False", "True"];

var sciQ = [
    "Is the earth flat?",
    "Does water boil at 100°C?",
    "Is the sun a planet?",
    "Do humans need oxygen to survive?",
    "Is gravity a force?"
];
var sciA = ["False", "True", "False", "True", "True"];

var currentSubjectClicked = "";
var myModal;


function getCurrentStudID() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "login.html";
        return null;
    }
    return currentUser.studid;
}


function getGradesKey() {
    var id = getCurrentStudID();
    if (!id) return null;
    return "schoolGrades_" + id;
}



function getDoneKey() {
    var id = getCurrentStudID();
    if (!id) return null;
    return "quizDone_" + id;
}


function getCompletedSubjects() {
    var key = getDoneKey();
    if (!key) return [];
    var saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
}


function markSubjectDone(subject) {
    var key = getDoneKey();
    if (!key) return;
    var done = getCompletedSubjects();
    if (done.indexOf(subject) === -1) {
        done.push(subject);
        localStorage.setItem(key, JSON.stringify(done));
    }
}


function setupQuizPage() {
    var done = getCompletedSubjects();

  
    var subjects = ["Math", "English", "Science"];
    var remaining = 0;

    for (var i = 0; i < subjects.length; i++) {
        var subj = subjects[i];
        var card = document.getElementById("card-" + subj);
        if (!card) continue;

        if (done.indexOf(subj) !== -1) {

            card.style.display = "none";
        } else {
            remaining++;
        }
    }


    var countLabel = document.getElementById("activityCount");
    if (countLabel) {
        countLabel.innerText = remaining + " created " + (remaining === 1 ? "activity" : "activities");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupQuizPage);
} else {
    setupQuizPage();
}

function startTest(subject) {
    var done = getCompletedSubjects();
    if (done.indexOf(subject) !== -1) {
        alert("You have already completed this activity.");
        return;
    }

    currentSubjectClicked = subject;
    document.getElementById("subjectTitle").innerText = subject;

    var questionBox = document.getElementById("quizContainer");
    questionBox.innerHTML = "";

    var questionsToUse = [];
    if (subject == "Math")    { questionsToUse = mathQ; }
    if (subject == "English") { questionsToUse = engQ; }
    if (subject == "Science") { questionsToUse = sciQ; }

    for (var i = 0; i < questionsToUse.length; i++) {
        var questionHTML = "<div class='card mb-3 p-3 bg-light'>";
        questionHTML += "<h5>" + (i + 1) + ". " + questionsToUse[i] + "</h5>";
        questionHTML += "<div class='form-check'>";
        questionHTML += "<input class='form-check-input' type='radio' name='ans" + i + "' value='True'> True <br>";
        questionHTML += "<input class='form-check-input' type='radio' name='ans" + i + "' value='False'> False";
        questionHTML += "</div></div>";
        questionBox.innerHTML += questionHTML;
    }

    myModal = new bootstrap.Modal(document.getElementById('quizModal'));
    myModal.show();
}



function submitTest() {
    var gradesKey = getGradesKey();
    if (!gradesKey) return;

    var myScore = 0;
    var answersToUse = [];

    if (currentSubjectClicked == "Math")    { answersToUse = mathA; }
    if (currentSubjectClicked == "English") { answersToUse = engA; }
    if (currentSubjectClicked == "Science") { answersToUse = sciA; }

    var totalItems = answersToUse.length;

    for (var i = 0; i < totalItems; i++) {
        var selectedAnswer = document.querySelector('input[name="ans' + i + '"]:checked');
        if (selectedAnswer != null) {
            if (selectedAnswer.value == answersToUse[i]) {
                myScore = myScore + 1;
            }
        }
    }

    var finalStatus = myScore >= 3 ? "Passed" : "Failed";

    var today = new Date();
    var record = {
        actName: "2526 " + currentSubjectClicked.toUpperCase() + "9 4Q",
        dateTaken: today.toLocaleDateString(),
        scorePts: myScore + " pts.",
        passFail: finalStatus
    };

    // Save grades under THIS user's key
    var oldData = localStorage.getItem(gradesKey);
    var dataArray = oldData ? JSON.parse(oldData) : [];
    dataArray.push(record);
    localStorage.setItem(gradesKey, JSON.stringify(dataArray));

    // Mark this subject as done for this user so the card disappears
    markSubjectDone(currentSubjectClicked);

    alert("Test submitted! You got " + myScore + " out of " + totalItems);
    window.location.href = "performance.html";
}