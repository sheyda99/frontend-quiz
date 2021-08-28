function Quiz(questions) {
    this.questions = questions;
    this.score = 0;
    this.questionIndex = 0;
}
Quiz.prototype.getQuestion = function() {
    return this.questions[this.questionIndex];
}
Quiz.prototype.isFinish = function() {
    return this.questions.length === this.questionIndex;
}
Quiz.prototype.guess = function(answer) {
    var question = this.getQuestion();
    if (question.answer === answer) {
        this.score++;
    }
    this.questionIndex++;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
readTextFile("../questions.json", function(text){
    var questions = JSON.parse(text);
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].quizName === document.querySelector("main").id) {
            var quiz = new Quiz(questions[i].questions);
        }
    }

    loadQuestion(quiz);
});


function loadQuestion(quiz) {
    if (quiz.isFinish()) {
        showScore(quiz);
    } else {
        var question = quiz.getQuestion();
        var choices = question.choices;
        document.querySelector("#question").innerHTML = question.question;
        for (var i = 0; i < choices.length; i++) {
            var element = document.querySelector("#choice-" + i);
            element.textContent = choices[i];
            guess(quiz, "#btn-" + i, choices[i]);
        }
        showProgress(quiz);
    }
}
function guess(quiz, id, guess) {
    document.querySelector(id).onclick = function() {
        quiz.guess(guess);
        loadQuestion(quiz);
    }
}
function showProgress(quiz) {
    document.querySelector("#progress").innerHTML = `Question ${quiz.questionIndex+1} of ${quiz.questions.length}`;
}
function showScore(quiz) {
    document.querySelector(".card").innerHTML = `<div class="card-body">
                                                    <h2 id="score">Score: ${quiz.score}</h2>
                                                    <div id="buttons">
                                                        <a href="/">Go to Homepage</a>
                                                    </div>
                                                </div>`;
}