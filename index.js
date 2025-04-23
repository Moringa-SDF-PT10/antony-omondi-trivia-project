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

    // Decode and display question text inside the element with ID questionContent 
    function displayQuestion(){
        reset()

        if (questionIndex >= questions.length){
            return displayScore()
        }

        const question = questions[questionIndex]
        questionContent.innerHTML = decodeHTML(question.question)

        const answers = [...question.incorrect_answers, question.correct_answers]
        shuffleAnswers(answers)

    }

    function displayScore(){
        quizSection.classList.add("hidden")
        resultsDisplay.classList.remove("hidden")
        finalScore.textContent = `${score} / ${questions.length}`
    }

    function decodeHTML(html){
        const text = document.createElement("textarea")
        text.innerHTML = html
        return text.value
    }

    function reset(){
        ansButtons.innerHTML = ""
        next.classList.add("hidden")
    }

    // Fisher-Yates shuffle to rearrange the answers positioning.
    // To prevent the answer being in the same position all the time.
    function shuffleAnswers(){
        for (let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1))
            [array[i], array[j]] = [array[j],array[i]]
        }
    }
})