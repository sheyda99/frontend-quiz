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
    var quiz = new Quiz(questions);

    loadQuestion();

    function loadQuestion() {
        if (quiz.isFinish()) {
            showScore();
        } else {
            var question = quiz.getQuestion();
            var choices = question.choices;

            document.querySelector("#question").textContent = question.question;

            for (var i = 0; i < choices.length; i++) {
                var element = document.querySelector("#choice-" + i);
                element.textContent = choices[i];
                guess("#btn-" + i, choices[i]);
            }

            showProgress();
        }
    }

    function guess(id, guess) {
        document.querySelector(id).onclick = function() {
            quiz.guess(guess);
            loadQuestion();
        }
    }
    function showProgress() {
        document.querySelector("#progress").innerHTML = `Question ${quiz.questionIndex+1} of ${quiz.questions.length}`;
    }
    function showScore() {
        document.querySelector(".card").innerHTML = `<div class="card-body"><h2 id="score">Score: ${quiz.score}</h2></div>`;
    }
});