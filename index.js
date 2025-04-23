document.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById("start-button")
    const quizSection = document.getElementById("quiz-section")
    const questionContent = document.getElementById("question-content")
    const ansButtons = document.getElementById("answer-btns")
    const next = document.getElementById("next-button")
    const resultsDisplay = document.getElementById("result-section")
    const finalScore = document.getElementById("final-score")
    const resetQuiz = document.getElementById("reset-btn")

    let questionIndex = 0
    let score = 0
    let questions = []

    start.addEventListener('click', startTrivia)

    function startTrivia(){
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(res => res.json())
        .then(data => {
            questions = data.results
            start.classList.add("hidden")
            quizSection.classList.remove("hidden")
            displayQuestion()
        })
    }

    function displayQuestion(){
        if (questionIndex >= questions.length){
            return displayScore()
        }
    }

    function displayScore(){
        quizSection.classList.add("hidden")
        resultsDisplay.classList.remove("hidden")
        finalScore.textContent = `${score} / ${questions.length}`
    }
})