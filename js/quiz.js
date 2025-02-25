document.addEventListener("DOMContentLoaded", () => {
    const questionNumberEl = document.querySelector(".question-number");
    const questionTextEl = document.querySelector(".question-text");
    const quizOptionsEl = document.querySelector(".quiz-options");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const container = document.querySelector(".container");

    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};

  
    fetch("../data/questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));

    function displayQuestion() {
        if (questions.length === 0) return;

        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = userAnswers[currentQuestionIndex];

        questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        questionTextEl.textContent = currentQuestion.question;

      
        quizOptionsEl.innerHTML = "";

  
        currentQuestion.options.forEach((option, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="radio" 
                       id="option-${index}" 
                       name="quiz-option" 
                       value="${option}"
                       ${userAnswer === option ? 'checked' : ''}>
                <label for="option-${index}">${option}</label>
            `;
            li.addEventListener("click", () => handleOptionClick(option, li));
            if(userAnswer === option) li.classList.add("selected");
            quizOptionsEl.appendChild(li);
        });

    
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
    }

    function handleOptionClick(selectedOption, liElement) {
     
        quizOptionsEl.querySelectorAll('li').forEach(li => li.classList.remove("selected"));
        
     
        liElement.classList.add("selected");
        userAnswers[currentQuestionIndex] = selectedOption;
    }

    function calculateFinalScore() {
        return Object.entries(userAnswers).reduce((acc, [index, answer]) => {
            const question = questions[parseInt(index)];
            if (question && question.answer) { 
                return acc + (answer.trim().toLowerCase() === question.answer.trim().toLowerCase() ? 1 : 0);
            }
            return acc;
        }, 0);
    }

    

    function showFinalScore() {
        const finalScore = calculateFinalScore();
        
        container.innerHTML = `
            <div class="score-container">
                <h2>Quiz Completed! 🎉</h2>
                <div class="score-display">
                    You scored ${finalScore} out of ${questions.length}
                </div>
                <button onclick="location.reload()">Retry Quiz</button>
            </div>
        `;
    }

    prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            showFinalScore();
        }
    });
});