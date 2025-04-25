document.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById("start-button");
    const quizSection = document.getElementById("quiz-section");
    const questionContent = document.getElementById("question-content");
    const ansButtons = document.getElementById("answer-btns");
    const next = document.getElementById("next-button");
    const resultsDisplay = document.getElementById("result-section");
    const finalScore = document.getElementById("final-score");
    const reviewSection = document.getElementById("review-section")
    const resetQuiz = document.getElementById("reset-btn");

    let questionIndex = 0;
    let score = 0;
    let questions = [];
    let incorrectAnswers = []

    start.addEventListener('click', startTrivia);

    // Moves to the next question when button is clicked
    next.addEventListener('click', () => {
        questionIndex++;
        displayQuestion();
    });

    // Reloads the entire page
    resetQuiz.addEventListener("click", () => {
        questionIndex = 0;
        score = 0;
        resultsDisplay.classList.add("hidden");
        start.classList.remove("hidden");
    });

    function startTrivia() {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                questions = data.results;
                start.classList.add("hidden");
                quizSection.classList.remove("hidden");
                displayQuestion();
            });
    }

    function displayQuestion() {
        reset();

        // Displays the finaScore if the questions are less than the question index
        if (questionIndex >= questions.length) {
            return displayScore();
        }

        const question = questions[questionIndex];
        questionContent.innerHTML = decodeHTML(question.question);

        const answers = [...question.incorrect_answers, question.correct_answer];
        shuffleAnswers(answers);

        // Iterates through every answer and assigns a button thus displaying buttons with their text content being the answers.
        answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = decodeHTML(answer);
            button.classList.add("answer-btn");

            button.addEventListener("click", () => {
                const correct = question.correct_answer;
                if (answer === correct) {
                    score++;
                }
                else {
                    incorrectAnswers.push({
                        question: question.question,
                        correct: correct
                    })
                }
                next.classList.remove("hidden");
                disableAnswerButtons();

                // Uses the Enter button to go to the next question
                document.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" && !next.classList.contains("hidden")){
                        next.click()
                    }
                })
            });

            button.addEventListener("mouseover", () => {
                button.classList.add("hovered")
            })

            button.addEventListener("mouseout", () => {
                button.classList.remove("hovered")
            })

            ansButtons.appendChild(button);
        });
    }

    // Decode the question to a readable on by humans.
    function decodeHTML(html) {
        const text = document.createElement("textarea");
        text.innerHTML = html;
        return text.value;
    }

    // Fisher-Yates shuffle to rearrange the answers positioning.
    // To prevent the answer being in the same position all the time.
    function shuffleAnswers(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function reset() {
        ansButtons.innerHTML = "";
        next.classList.add("hidden");
    }

    function disableAnswerButtons() {
        const allButtons = document.querySelectorAll(".answer-btn");
        allButtons.forEach(btn => {
            btn.disabled = true;
        });
    }

    // Display final score after all questions are answered.
    function displayScore() {
        quizSection.classList.add("hidden");
        resultsDisplay.classList.remove("hidden");
        finalScore.textContent = `${score} / ${questions.length}`;

        reviewSection.innerHTML = ""

        if (incorrectAnswers.length > 0){
            const h3 = document.createElement("h3")
            h3.textContent = "Correct Answers"
            reviewSection.appendChild(h3)

            incorrectAnswers.forEach(entry => {
                const div = document.createElement("div");
                div.classList.add("review-item");
                div.innerHTML = `
                <p><strong>Question:</strong> ${decodeHTML(entry.question)}</p>
                <p><strong>Answer:</strong> ${decodeHTML(entry.correct)}</p>
            `;
                reviewSection.appendChild(div);
            });
        }
        else {
            reviewSection.textContent = "All questions answered correctly. Congradulations!!"
        }
    }
});
