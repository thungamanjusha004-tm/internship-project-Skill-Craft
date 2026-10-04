// ==========================================
// QUIZ QUESTIONS
// ==========================================

const questions = [

    // SINGLE SELECT
    {
        type: "single",

        question: "Which language is mainly used to create the structure of a web page?",

        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ],

        answer: 0
    },


    // MULTI SELECT
    {
        type: "multi",

        question: "Which of the following are programming languages?",

        options: [
            "Python",
            "Java",
            "HTML",
            "JavaScript"
        ],

        answer: [0, 1, 3]
    },


    // FILL IN THE BLANK
    {
        type: "fill",

        question: "What does CSS stand for?",

        answer: "cascading style sheets"
    },


    // SINGLE SELECT
    {
        type: "single",

        question: "Which company developed the Android operating system?",

        options: [
            "Microsoft",
            "Google",
            "Apple",
            "IBM"
        ],

        answer: 1
    },


    // MULTI SELECT
    {
        type: "multi",

        question: "Which of these are web browsers?",

        options: [
            "Chrome",
            "Firefox",
            "Photoshop",
            "Edge"
        ],

        answer: [0, 1, 3]
    }

];


// ==========================================
// VARIABLES
// ==========================================

let currentQuestion = 0;

let score = 0;

let userAnswers = [];


// ==========================================
// START QUIZ
// ==========================================

function startQuiz() {

    currentQuestion = 0;

    score = 0;

    userAnswers = [];

    document
        .getElementById("startScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.add("hidden");

    document
        .getElementById("quizScreen")
        .classList.remove("hidden");

    showQuestion();
}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    const question =
        questions[currentQuestion];

    const questionElement =
        document.getElementById("question");

    const answersElement =
        document.getElementById("answers");

    const feedback =
        document.getElementById("feedback");


    // Question number

    document.getElementById(
        "questionNumber"
    ).textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    // Score

    document.getElementById(
        "scoreDisplay"
    ).textContent =
        `Score: ${score}`;


    // Progress

    const progress =
        ((currentQuestion + 1) /
            questions.length) * 100;

    document.getElementById(
        "progressBar"
    ).style.width =
        `${progress}%`;


    // Question text

    questionElement.textContent =
        question.question;


    // Clear answers

    answersElement.innerHTML = "";

    feedback.textContent = "";


    // ======================================
    // SINGLE SELECT
    // ======================================

    if (question.type === "single") {

        question.options.forEach(
            (option, index) => {

                const label =
                    document.createElement("label");

                label.className =
                    "answer-option";

                label.innerHTML = `
                    <input
                        type="radio"
                        name="answer"
                        value="${index}">
                    <span>${option}</span>
                `;

                answersElement.appendChild(label);
            }
        );
    }


    // ======================================
    // MULTI SELECT
    // ======================================

    else if (question.type === "multi") {

        question.options.forEach(
            (option, index) => {

                const label =
                    document.createElement("label");

                label.className =
                    "answer-option";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${index}">
                    <span>${option}</span>
                `;

                answersElement.appendChild(label);
            }
        );
    }


    // ======================================
    // FILL IN THE BLANK
    // ======================================

    else if (question.type === "fill") {

        const input =
            document.createElement("input");

        input.type = "text";

        input.className =
            "fill-input";

        input.id =
            "fillAnswer";

        input.placeholder =
            "Type your answer here...";

        answersElement.appendChild(input);
    }


    // Previous button

    document.getElementById(
        "prevBtn"
    ).disabled =
        currentQuestion === 0;


    // Next button

    document.getElementById(
        "nextBtn"
    ).textContent =
        currentQuestion === questions.length - 1
            ? "Finish ✓"
            : "Next →";


    // Restore previous answer

    restoreAnswer();
}


// ==========================================
// SAVE CURRENT ANSWER
// ==========================================

function saveAnswer() {

    const question =
        questions[currentQuestion];


    // SINGLE

    if (question.type === "single") {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        if (!selected) {
            return null;
        }

        return Number(selected.value);
    }


    // MULTIPLE

    if (question.type === "multi") {

        const selected =
            document.querySelectorAll(
                '#answers input[type="checkbox"]:checked'
            );

        if (selected.length === 0) {
            return null;
        }

        return Array.from(selected)
            .map(input => Number(input.value));
    }


    // FILL

    if (question.type === "fill") {

        const input =
            document.getElementById(
                "fillAnswer"
            );

        if (!input) {
            return null;
        }

        return input.value.trim();
    }
}


// ==========================================
// RESTORE ANSWER
// ==========================================

function restoreAnswer() {

    if (
        userAnswers[currentQuestion] ===
        undefined
    ) {
        return;
    }

    const saved =
        userAnswers[currentQuestion];


    const question =
        questions[currentQuestion];


    // SINGLE

    if (question.type === "single") {

        const input =
            document.querySelector(
                `input[value="${saved}"]`
            );

        if (input) {
            input.checked = true;
        }
    }


    // MULTI

    if (question.type === "multi") {

        saved.forEach(index => {

            const input =
                document.querySelector(
                    `input[value="${index}"]`
                );

            if (input) {
                input.checked = true;
            }
        });
    }


    // FILL

    if (question.type === "fill") {

        document.getElementById(
            "fillAnswer"
        ).value = saved;
    }
}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer() {

    const question =
        questions[currentQuestion];

    const userAnswer =
        saveAnswer();


    if (userAnswer === null) {

        document.getElementById(
            "feedback"
        ).textContent =
            "⚠️ Please answer the question.";

        document.getElementById(
            "feedback"
        ).style.color =
            "#dc3545";

        return false;
    }


    userAnswers[currentQuestion] =
        userAnswer;


    let correct = false;


    // SINGLE

    if (question.type === "single") {

        correct =
            userAnswer === question.answer;
    }


    // MULTI

    else if (question.type === "multi") {

        const userSorted =
            [...userAnswer].sort();

        const correctSorted =
            [...question.answer].sort();

        correct =
            JSON.stringify(userSorted) ===
            JSON.stringify(correctSorted);
    }


    // FILL

    else if (question.type === "fill") {

        correct =
            userAnswer.toLowerCase() ===
            question.answer.toLowerCase();
    }


    if (correct) {

        // Only award points once
        if (!userAnswers[currentQuestion + "_scored"]) {

            score++;

            userAnswers[currentQuestion + "_scored"] =
                true;
        }

        document.getElementById(
            "feedback"
        ).textContent =
            "✅ Correct!";

        document.getElementById(
            "feedback"
        ).style.color =
            "#28a745";

    } else {

        document.getElementById(
            "feedback"
        ).textContent =
            "❌ Incorrect!";

        document.getElementById(
            "feedback"
        ).style.color =
            "#dc3545";
    }


    document.getElementById(
        "scoreDisplay"
    ).textContent =
        `Score: ${score}`;

    return true;
}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (!checkAnswer()) {
        return;
    }


    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    } else {

        showResult();
    }
}


// ==========================================
// PREVIOUS QUESTION
// ==========================================

function previousQuestion() {

    if (currentQuestion > 0) {

        userAnswers[currentQuestion] =
            saveAnswer();

        currentQuestion--;

        showQuestion();
    }
}


// ==========================================
// SHOW RESULT
// ==========================================

function showResult() {

    document
        .getElementById("quizScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.remove("hidden");


    document.getElementById(
        "finalScore"
    ).textContent =
        `${score} / ${questions.length}`;


    const percentage =
        (score / questions.length) * 100;


    let message;


    if (percentage === 100) {

        message =
            "🏆 Perfect score! Excellent work!";

    } else if (percentage >= 80) {

        message =
            "🌟 Great job! You know your stuff!";

    } else if (percentage >= 50) {

        message =
            "👍 Good effort! Keep practicing!";

    } else {

        message =
            "📚 Keep learning and try again!";
    }


    document.getElementById(
        "resultMessage"
    ).textContent =
        message;
}


// ==========================================
// RESTART QUIZ
// ==========================================

function restartQuiz() {

    score = 0;

    currentQuestion = 0;

    userAnswers = [];

    document
        .getElementById("resultScreen")
        .classList.add("hidden");

    document
        .getElementById("quizScreen")
        .classList.remove("hidden");

    showQuestion();
}
