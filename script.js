let questions = null;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

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

function resetQuiz() {
    questions = null;
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
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
}