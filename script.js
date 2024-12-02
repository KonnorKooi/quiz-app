let questions = null;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = []; // Array to store user's answers

const sampleJson = {
    questions: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
        }
    ]
};

// Initialize the sample JSON format
document.getElementById('json-format').textContent = JSON.stringify(sampleJson, null, 2);

function validateJson(json) {
    if (!json.questions || !Array.isArray(json.questions)) return false;
    return json.questions.every(q => 
        q.question && 
        Array.isArray(q.options) && 
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 && 
        q.correctAnswer < q.options.length
    );
}

function handleJsonSubmit() {
    const jsonInput = document.getElementById('json-input').value;
    try {
        const parsedJson = JSON.parse(jsonInput);
        if (validateJson(parsedJson)) {
            questions = parsedJson.questions;
            currentQuestion = 0;
            score = 0;
            selectedAnswer = null;
            userAnswers = new Array(questions.length).fill(null); // Initialize user answers array
            showQuizScreen();
            renderQuestion();
        } else {
            alert("Invalid JSON format. Please check the specification.");
        }
    } catch (e) {
        alert("Invalid JSON. Please check your input.");
    }
}

function handleAnswer(selectedIndex) {
    if (selectedAnswer !== null) return;
    selectedAnswer = selectedIndex;
    userAnswers[currentQuestion] = selectedIndex; // Store user's answer
    
    const question = questions[currentQuestion];
    const correct = question.correctAnswer === selectedIndex;
    
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.add('disabled'));
    
    if (correct) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        score++;
        buttons[selectedIndex].classList.add('correct');
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correctAnswer].classList.add('correct');
    }
    
    document.getElementById('next-button').classList.remove('hidden');
}

function handleNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        renderQuestion();
    } else {
        showResultsScreen();
    }
}

function renderQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestion + 1} of ${questions.length}`;
    
    document.getElementById('next-button').classList.add('hidden');
}

function renderQuizReview() {
    const reviewContainer = document.getElementById('quiz-review');
    reviewContainer.innerHTML = '<h3>Quiz Review</h3>';

    questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'review-question';
        
        // Question text
        const questionText = document.createElement('p');
        questionText.className = 'review-question-text';
        questionText.textContent = `Q${qIndex + 1}: ${question.question}`;
        questionDiv.appendChild(questionText);
        
        // Options
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'review-options';
        
        question.options.forEach((option, oIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'review-option';
            
            // Add appropriate classes based on correct/user answers
            if (oIndex === question.correctAnswer) {
                optionDiv.classList.add('correct');
            }
            if (userAnswers[qIndex] === oIndex) {
                optionDiv.classList.add(oIndex === question.correctAnswer ? 'user-correct' : 'user-incorrect');
            }
            
            optionDiv.textContent = option;
            optionsDiv.appendChild(optionDiv);
        });
        
        questionDiv.appendChild(optionsDiv);
        reviewContainer.appendChild(questionDiv);
    });
}

function resetQuiz() {
    questions = null;
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    userAnswers = [];
    document.getElementById('json-input').value = '';
    showStartScreen();
}

function showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
}

function showQuizScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
}

function showResultsScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    document.getElementById('score-text').textContent = 
        `Your score: ${score} out of ${questions.length}`;
    renderQuizReview();
}