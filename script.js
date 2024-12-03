let questions = null;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];
let currentQuizType = 'regular';

const sampleRegularJson = {
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

const sampleCodeJson = {
    questions: [
        {
            question: "Complete the Observer Pattern's update method:",
            patternName: "Observer Pattern",
            codeContext: "public class MessageProcessorObserver implements Observer {..}",
            missingCode: {
                beforePrompt: "public void update(Observable observable) {",
                solution: "MessageProcessor messageProcessor = (MessageProcessor)observable;",
                afterPrompt: "}"
            }
        },
        {
            question: "Complete the Factory Pattern's createProduct method:",
            patternName: "Factory Pattern",
            codeContext: "public class ProductFactory {..}",
            missingCode: {
                beforePrompt: "public Product createProduct(String type) {",
                solution: "return new ConcreteProduct(type);",
                afterPrompt: "}"
            }
        }
    ]
};

function validateRegularJson(json) {
    if (!json.questions || !Array.isArray(json.questions)) return false;
    return json.questions.every(q => 
        q.question && 
        Array.isArray(q.options) && 
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 && 
        q.correctAnswer < q.options.length
    );
}

function validateCodeJson(json) {
    if (!json.questions || !Array.isArray(json.questions)) return false;
    return json.questions.every(q => 
        q.question &&
        q.patternName &&
        q.codeContext &&
        q.missingCode &&
        q.missingCode.beforePrompt &&
        q.missingCode.solution &&
        q.missingCode.afterPrompt
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
    if (currentQuizType === 'regular') {
        renderRegularQuestion();
    } else {
        renderCodeQuestion(questions[currentQuestion]);
    }
}

function renderCodeQuestion(question) {
    const quizScreen = document.getElementById('quiz-screen');
    
    // Create a template div to store the new content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <h2>${question.patternName}</h2>
        <p>${question.question}</p>
        <div class="code-container">
            <pre class="code-context">${question.codeContext}</pre>
            <pre class="code-prompt">${question.missingCode.beforePrompt}</pre>
            <textarea class="code-input" rows="4" placeholder="Type your solution here..."></textarea>
            <pre class="code-prompt">${question.missingCode.afterPrompt}</pre>
        </div>
        <div class="bottom-bar">
            <div id="question-counter">Question ${currentQuestion + 1} of ${questions.length}</div>
            <div class="button-group">
                <button onclick="checkCodeAnswer()" class="check-button">Check Answer</button>
                <button onclick="showSolution()" class="solution-button hidden">Show Solution</button>
                <button id="next-button" class="hidden" onclick="handleNextQuestion()">Next Question</button>
            </div>
        </div>
        <div class="similarity-score hidden"></div>
    `;
    
    // Clear existing content except the back button
    const backButton = quizScreen.querySelector('#back-button');
    quizScreen.innerHTML = '';
    quizScreen.appendChild(backButton);
    
    // Add all the new elements
    while (contentDiv.firstChild) {
        quizScreen.appendChild(contentDiv.firstChild);
    }
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

function handleBack() {
    if (confirm("Are you sure you want to go back? Your progress will be lost.")) {
        resetQuiz();
        showStartScreen();
    }
}

// Modify your showQuizScreen function
function showQuizScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('quiz-type-selector').classList.add('hidden');
}

// Modify your showStartScreen function
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('quiz-type-selector').classList.remove('hidden');
    document.getElementById('back-button').classList.add('hidden');
}

// Modify your showResultsScreen function
function showResultsScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    document.getElementById('quiz-type-selector').classList.add('hidden');
    
    // Display final score
    const scoreText = document.getElementById('score-text');
    if (currentQuizType === 'regular') {
        const percentage = Math.round((score / questions.length) * 100);
        scoreText.textContent = `Your score: ${score} out of ${questions.length} (${percentage}%)`;
        // Render the quiz review for regular quizzes
        renderQuizReview();
    } else {
        // For code quizzes, we might want to show average similarity score
        const similarityScores = document.querySelectorAll('.similarity-score');
        let totalSimilarity = 0;
        similarityScores.forEach(score => {
            const scoreValue = parseInt(score.textContent.match(/\d+/)[0]);
            totalSimilarity += scoreValue;
        });
        const averageSimilarity = Math.round(totalSimilarity / questions.length);
        // scoreText.textContent = `Average similarity score: ${averageSimilarity}%`;
    }
}

function calculateStringSimilarity(str1, str2) {
    // Normalize strings by removing extra whitespace and making lowercase
    const normalize = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();
    str1 = normalize(str1);
    str2 = normalize(str2);
    
    // Calculate Levenshtein distance
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i-1] === str2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(
                    dp[i-1][j-1] + 1,
                    dp[i-1][j] + 1,
                    dp[i][j-1] + 1
                );
            }
        }
    }
    
    // Return similarity percentage
    const maxLength = Math.max(m, n);
    const similarity = (1 - dp[m][n] / maxLength) * 100;
    return Math.round(similarity);
}

function renderRegularQuestion() {
    const question = questions[currentQuestion];
    const quizScreen = document.getElementById('quiz-screen');
    
    // Create a template div to store the new content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <h2 id="question-text">${question.question}</h2>
        <div id="options-container">
            ${question.options.map((option, index) => `
                <button class="option-button" onclick="handleAnswer(${index})">${option}</button>
            `).join('')}
        </div>
        <div class="bottom-bar">
            <div id="question-counter">Question ${currentQuestion + 1} of ${questions.length}</div>
            <button id="next-button" class="hidden" onclick="handleNextQuestion()">Next Question</button>
        </div>
    `;
    
    // Clear existing content except the back button
    const backButton = quizScreen.querySelector('#back-button');
    quizScreen.innerHTML = '';
    quizScreen.appendChild(backButton);
    
    // Add all the new elements
    while (contentDiv.firstChild) {
        quizScreen.appendChild(contentDiv.firstChild);
    }
}

function renderCodeQuestion(question) {
    const quizScreen = document.getElementById('quiz-screen');
    
    // Create a template div to store the new content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <h2>${question.patternName}</h2>
        <p>${question.question}</p>
        <div class="code-container">
            <pre class="code-context">${question.codeContext}</pre>
            <pre class="code-prompt">${question.missingCode.beforePrompt}</pre>
            <textarea class="code-input" rows="4" placeholder="Type your solution here..."></textarea>
            <pre class="code-prompt">${question.missingCode.afterPrompt}</pre>
        </div>
        <div class="bottom-bar">
            <div id="question-counter">Question ${currentQuestion + 1} of ${questions.length}</div>
            <div class="button-container">
                <button onclick="checkCodeAnswer()" class="check-button">Check Answer</button>
                <button class="solution-button hidden" onclick="showSolution()">Show Solution</button>
                <button id="next-button" class="hidden" onclick="handleNextQuestion()">Next Question</button>
            </div>
        </div>
        <div class="similarity-score hidden"></div>
    `;
    
    // Clear existing content except the back button
    const backButton = document.getElementById('back-button').cloneNode(true);
    quizScreen.innerHTML = '';
    quizScreen.appendChild(backButton);
    
    // Add all the new elements
    while (contentDiv.firstChild) {
        quizScreen.appendChild(contentDiv.firstChild);
    }
}

function checkCodeAnswer() {
    const question = questions[currentQuestion];
    const userCode = document.querySelector('.code-input').value;
    const similarity = calculateStringSimilarity(userCode, question.missingCode.solution);
    
    const scoreDiv = document.querySelector('.similarity-score');
    scoreDiv.textContent = `Similarity Score: ${similarity}%`;
    scoreDiv.classList.remove('hidden');
    
    if (similarity >= 90) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    // Show solution and next buttons
    document.querySelector('.solution-button').classList.remove('hidden');
    document.getElementById('next-button').classList.remove('hidden');
}

function showSolution() {
    const question = questions[currentQuestion];
    const codeInput = document.querySelector('.code-input');
    codeInput.value = question.missingCode.solution;
}

function setQuizType(type, eventTarget = null) {
    currentQuizType = type;
    
    // Update UI to reflect selected type
    document.querySelectorAll('.quiz-type-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(type)) {
            button.classList.add('active');
        }
    });
    
    // Update sample JSON and title based on type
    const formatTitle = document.getElementById('format-title');
    const jsonFormat = document.getElementById('json-format');
    
    if (type === 'regular') {
        formatTitle.textContent = 'Regular Quiz JSON Format';
        jsonFormat.textContent = JSON.stringify(sampleRegularJson, null, 2);
    } else {
        formatTitle.textContent = 'Code Pattern Quiz JSON Format';
        jsonFormat.textContent = JSON.stringify(sampleCodeJson, null, 2);
    }
}

function handleJsonSubmit() {
    const jsonInput = document.getElementById('json-input').value;
    try {
        const parsedJson = JSON.parse(jsonInput);
        if (currentQuizType === 'regular') {
            if (validateRegularJson(parsedJson)) {
                questions = parsedJson.questions;
                currentQuestion = 0;
                score = 0;
                selectedAnswer = null;
                userAnswers = new Array(questions.length).fill(null);
                showQuizScreen();
                renderQuestion();
            } else {
                alert("Invalid regular quiz format. Please check the specification.");
            }
        } else {
            if (validateCodeJson(parsedJson)) {
                questions = parsedJson.questions;
                currentQuestion = 0;
                score = 0;
                showQuizScreen();
                renderQuestion();
            } else {
                alert("Invalid code quiz format. Please check the specification.");
            }
        }
    } catch (e) {
        alert("Invalid JSON. Please check your input.");
        console.error(e);
    }
}

window.onload = function() {
    setQuizType('regular');
    // This ensures the regular quiz format is shown on initial load
    document.getElementById('json-format').textContent = JSON.stringify(sampleRegularJson, null, 2);
};