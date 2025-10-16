let questions = null;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];
let currentQuizType = 'regular';
let originalQuestions = null; // To store the original order of questions
let shouldRandomizeQuestions = false;
let shouldRandomizeAnswers = false;
let visitedQuestions = new Set(); // Track which questions the user has seen

const CACHE_PREFIX = 'quiz_cache_';
const CACHE_DURATION = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds
const API_ENDPOINT = './api/quizzes.php';
// Update the sample JSON formats to include a title
const sampleRegularJson = {
    title: "Sample Quiz",
    instructions: "Create a quiz following this format. IMPORTANT: Place the correct answer FIRST (index 0) in the options array - the app will randomize the order automatically. Make all answer options similar in length to avoid bias. Use KaTeX for math ($expression$ for inline, $$expression$$ for display) and markdown for formatting (code blocks, **bold**, *italic*, etc.). Ask complex questions that test deep understanding.",
    questions: [
        {
            question: "What is the derivative of $f(x) = x^2 + 3x$?",
            options: ["$2x + 3$", "$x + 3$", "$2x^2 + 3x$", "$x^2 + 3$"],
            correctAnswer: 0
        },
        {
            question: "Which sorting algorithm has this implementation?\n\n```python\ndef sort(arr):\n    for i in range(len(arr)):\n        for j in range(len(arr) - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n```",
            options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
            correctAnswer: 0
        },
        {
            question: "In thermodynamics, what does the formula $$\\Delta G = \\Delta H - T\\Delta S$$ represent?",
            options: ["Gibbs free energy change", "Entropy change", "Enthalpy change", "Heat capacity"],
            correctAnswer: 0
        }
    ]
};

const sampleCodeJson = {
    title: "Sample Code Quiz",
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

// Initialize markdown-it with code highlighting
const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});

// Function to render text with markdown and KaTeX
function renderMarkdownAndMath(text) {
    // First, render markdown
    let html = md.render(text);

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Render KaTeX in the temp div
    renderMathInElement(tempDiv, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false
    });

    return tempDiv.innerHTML;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const newArray = [...array]; // Create a copy to avoid modifying the original
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Randomize the order of questions
function randomizeQuestions(questionsArray) {
    return shuffleArray(questionsArray);
}

// Randomize the order of answer options while preserving the correct answer
function randomizeAnswerOptions(question) {
    if (currentQuizType === 'code') return question; // Don't randomize code questions

    const newQuestion = { ...question };
    const correctOption = newQuestion.options[newQuestion.correctAnswer];
    
    // Shuffle the options
    const shuffledOptions = shuffleArray(newQuestion.options);
    newQuestion.options = shuffledOptions;
    
    // Find the new index of the correct answer
    newQuestion.correctAnswer = shuffledOptions.indexOf(correctOption);
    
    return newQuestion;
}

function validateRegularJson(json) {
    if (!json.title || typeof json.title !== 'string' || json.title.trim() === '') return false;
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
    if (!json.title || typeof json.title !== 'string' || json.title.trim() === '') return false;
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
function validateJson(json) {
    return currentQuizType === 'regular' ? validateRegularJson(json) : validateCodeJson(json);
}
async function handleJsonSubmit() {
    const jsonInput = document.getElementById('json-input').value;
    try {
        const parsedJson = JSON.parse(jsonInput);
        if (validateJson(parsedJson)) {
            originalQuestions = [...parsedJson.questions]; // Store original questions

            // Apply randomization settings
            shouldRandomizeQuestions = false; // Keep question order as-is
            shouldRandomizeAnswers = true; // Always randomize answers

            // Process questions based on randomization settings
            let processedQuestions = [...parsedJson.questions];

            // Always randomize answer options for regular quizzes
            if (currentQuizType === 'regular') {
                processedQuestions = processedQuestions.map(q => randomizeAnswerOptions(q));
            }

            questions = processedQuestions;
            
            // Cache the quiz for future use
            await cacheQuiz(jsonInput);
            
            currentQuestion = 0;
            score = 0;
            selectedAnswer = null;
            userAnswers = new Array(questions.length).fill(null); // Initialize user answers array
            visitedQuestions = new Set([0]); // Start with the first question as visited
            
            showQuizScreen();
            renderQuestion();
            updateQuestionNavigation();
        } else {
            alert("Invalid JSON format. Please check the specification.");
        }
    } catch (e) {
        alert("Invalid JSON. Please check your input.");
        console.error(e);
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
        triggerConfetti('medium'); // Default confetti for correct answers
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
        visitedQuestions.add(currentQuestion); // Mark the new question as visited
        selectedAnswer = null;
        renderQuestion();
        updateQuestionNavigation();
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
    
    // Clear existing content except the back button and quiz controls
    const backButton = quizScreen.querySelector('#back-button');
    const quizControls = quizScreen.querySelector('.quiz-controls');
    quizScreen.innerHTML = '';
    quizScreen.appendChild(backButton);
    quizScreen.appendChild(quizControls);
    
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
        const questionNumber = document.createElement('strong');
        questionNumber.textContent = `Q${qIndex + 1}: `;
        questionText.appendChild(questionNumber);

        const questionContent = document.createElement('span');
        questionContent.innerHTML = renderMarkdownAndMath(question.question);
        questionText.appendChild(questionContent);
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

            optionDiv.innerHTML = renderMarkdownAndMath(option);
            optionsDiv.appendChild(optionDiv);
        });

        questionDiv.appendChild(optionsDiv);
        reviewContainer.appendChild(questionDiv);
    });
}

function resetQuiz() {
    questions = null;
    originalQuestions = null;
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    userAnswers = [];
    visitedQuestions = new Set();
    document.getElementById('json-input').value = '';
    showStartScreen();
}

function handleBack() {
    if (confirm("Are you sure you want to go back? Your progress will be lost.")) {
        resetQuiz();
        showStartScreen();
    }
}

// Show quiz screen
function showQuizScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('quiz-type-selector').classList.add('hidden');
}

// Show start screen
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('quiz-type-selector').classList.remove('hidden');
}

// Show results screen
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
        let validScores = 0;
        
        similarityScores.forEach(score => {
            if (score.textContent) {
                const match = score.textContent.match(/\d+/);
                if (match) {
                    totalSimilarity += parseInt(match[0]);
                    validScores++;
                }
            }
        });
        
        const averageSimilarity = validScores > 0 ? Math.round(totalSimilarity / validScores) : 0;
        scoreText.textContent = `Average similarity score: ${averageSimilarity}%`;
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

    // Clear existing content except the quiz header
    const quizHeader = quizScreen.querySelector('.quiz-header');
    quizScreen.innerHTML = '';
    quizScreen.appendChild(quizHeader);

    // Create and render the question text with markdown and math
    const questionHeading = document.createElement('h2');
    questionHeading.id = 'question-text';
    questionHeading.innerHTML = renderMarkdownAndMath(question.question);
    quizScreen.appendChild(questionHeading);

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.id = 'options-container';

    // Create option buttons with rendered content
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = renderMarkdownAndMath(option);
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });

    quizScreen.appendChild(optionsContainer);

    // Create bottom bar
    const bottomBar = document.createElement('div');
    bottomBar.className = 'bottom-bar';
    bottomBar.innerHTML = `
        <div id="question-counter">Question ${currentQuestion + 1} of ${questions.length}</div>
        <button id="next-button" class="hidden" onclick="handleNextQuestion()">Next Question</button>
    `;
    quizScreen.appendChild(bottomBar);

    // Update navigation dropdown
    updateQuestionNavigation();

    // If user has already answered this question, show the answer
    if (userAnswers[currentQuestion] !== null) {
        // Show the user's answer and correct/incorrect status
        selectedAnswer = userAnswers[currentQuestion];
        const buttons = document.querySelectorAll('.option-button');
        buttons.forEach(button => button.classList.add('disabled'));

        const correct = question.correctAnswer === selectedAnswer;
        if (correct) {
            buttons[selectedAnswer].classList.add('correct');
        } else {
            buttons[selectedAnswer].classList.add('incorrect');
            buttons[question.correctAnswer].classList.add('correct');
        }

        document.getElementById('next-button').classList.remove('hidden');
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
        triggerConfetti('medium'); // Default confetti for high similarity
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

function setQuizType(type) {
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
        formatTitle.textContent = 'Quiz JSON Format';
        jsonFormat.textContent = JSON.stringify(sampleRegularJson, null, 2);
    } else {
        formatTitle.textContent = 'Code Pattern Quiz JSON Format';
        jsonFormat.textContent = JSON.stringify(sampleCodeJson, null, 2);
    }
}

// Function to show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to hide modal
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to trigger confetti with different intensity levels
// Confetti shoots from the sides instead of center
function triggerConfetti(intensity = 'medium') {
    let particleCount, spread, startVelocity, scalar;

    switch (intensity) {
        case 'low':
            particleCount = 50;
            spread = 50;
            startVelocity = 20;
            scalar = 0.8;
            break;
        case 'high':
            particleCount = 150;
            spread = 80;
            startVelocity = 40;
            scalar = 1.2;
            break;
        case 'extreme':
            particleCount = 25000;
            spread = 1000;
            startVelocity = 60;
            scalar = 2.0;
            break;
        case 'medium':
        default:
            particleCount = 100;
            spread = 70;
            startVelocity = 30;
            scalar = 1.0;
    }

    // Fire confetti from both left and right sides
    const defaults = {
        particleCount: Math.floor(particleCount / 2),
        spread,
        startVelocity,
        scalar,
        zIndex: 2000,
        gravity: 1,
        drift: 0,
        ticks: 200
    };

    // Left side confetti (shooting right and slightly down)
    confetti({
        ...defaults,
        origin: { x: 0, y: 0.5 },
        angle: 60,
        spread: spread
    });

    // Right side confetti (shooting left and slightly down)
    confetti({
        ...defaults,
        origin: { x: 1, y: 0.5 },
        angle: 120,
        spread: spread
    });
}
// Function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Function to update the question navigation dropdown
function updateQuestionNavigation() {
    const questionNav = document.getElementById('question-nav');
    questionNav.innerHTML = '<option value="-1">Jump to question...</option>';
    
    // Add only visited questions to the dropdown
    Array.from(visitedQuestions).sort((a, b) => a - b).forEach(qIndex => {
        const q = questions[qIndex];
        const questionText = q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question;
        const option = document.createElement('option');
        option.value = qIndex;
        option.textContent = `Q${qIndex + 1}: ${questionText}`;
        if (qIndex === currentQuestion) {
            option.selected = true;
        }
        questionNav.appendChild(option);
    });
}

// Function to navigate to a specific question
function navigateToQuestion(questionIndex) {
    if (questionIndex >= 0 && questionIndex < questions.length) {
        currentQuestion = questionIndex;
        selectedAnswer = userAnswers[questionIndex]; // Set to the user's answer for this question, or null if not answered
        renderQuestion();
        updateQuestionNavigation();
    }
}



// Simple hash function for generating cache keys
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// Event handlers for the entire app
function setupEventListeners() {
    // Help button and modal
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    
    helpButton.addEventListener('click', () => showModal('help-modal'));
    closeModal.addEventListener('click', () => hideModal('help-modal'));
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            hideModal('help-modal');
        }
    });
    
    // Copy JSON button
    const copyJsonBtn = document.getElementById('copy-json-btn');
    copyJsonBtn.addEventListener('click', () => {
        const jsonText = document.getElementById('json-format').textContent;
        copyToClipboard(jsonText);
        copyJsonBtn.querySelector('.tooltip').textContent = 'Copied!';
        setTimeout(() => {
            copyJsonBtn.querySelector('.tooltip').textContent = 'Copy';
        }, 2000);
    });
    
    // Confetti button
    const confettiButton = document.getElementById('confetti-button');
    confettiButton.addEventListener('click', () => {
        const intensity = document.getElementById('confetti-intensity').value;
        triggerConfetti(intensity);
    });
    
    // Question navigation dropdown
    const questionNav = document.getElementById('question-nav');
    questionNav.addEventListener('change', (e) => {
        const selectedIndex = parseInt(e.target.value);
        if (selectedIndex >= 0) {
            navigateToQuestion(selectedIndex);
        }
    });
}

// Initialize on page load
window.onload = function() {
    setQuizType('regular');
    setupEventListeners();
    
    // Set up initial JSON format display
    document.getElementById('json-format').textContent = JSON.stringify(sampleRegularJson, null, 2);
};

// Update the loadDesignPatternQuiz function to add a title
async function loadDesignPatternQuiz() {
    try {
        const response = await fetch('design-patterns-quiz.json');
        const data = await response.json();
        
        // Add title if not present
        if (!data.title) {
            data.title = "Design Patterns Quiz";
        }
        
        // Set the quiz type to code
        setQuizType('code');
        
        // Convert back to string for caching
        const jsonString = JSON.stringify(data);
        
        // Set it to the textarea
        document.getElementById('json-input').value = jsonString;
        
        // Process the quiz
        handleJsonSubmit();
    } catch (error) {
        console.error('Error loading design patterns quiz:', error);
        alert('Failed to load the design patterns quiz. Please try again.');
    }
}

// Update the loadAWSquiz1 function to add a title
async function loadAWSquiz1() {
    try {
        const response = await fetch('AWSquiz1.json');
        const data = await response.json();
        
        // Add title if not present
        if (!data.title) {
            data.title = "AWS Quiz 1";
        }
        
        // Set the quiz type to regular
        setQuizType('regular');
        
        // Convert back to string for caching
        const jsonString = JSON.stringify(data);
        
        // Set it to the textarea
        document.getElementById('json-input').value = jsonString;
        
        // Process the quiz
        handleJsonSubmit();
    } catch (error) {
        console.error('Error loading AWS quiz:', error);
        alert('Failed to load the AWS quiz. Please try again.');
    }
}

// Call this function when the page loads to show recent quizzes
window.addEventListener('DOMContentLoaded', function() {
    updateRecentQuizzes();
});


async function loadQuizzesFromServer() {
    try {
        const response = await fetch('/api/quizzes.php');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'success') {
            return result.data || [];
        } else {
            console.error('Server returned error:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error loading quizzes from server:', error);
        return [];
    }
}

// Function to load a quiz from server data
function loadQuizFromServerData(quiz) {
    try {
        if (quiz && quiz.data) {
            // Set the quiz type
            setQuizType(quiz.type || 'regular');
            
            // Set the JSON input
            document.getElementById('json-input').value = quiz.data;
            
            // Load the quiz
            handleJsonSubmit();
        }
    } catch (error) {
        console.error('Error loading quiz from server data:', error);
        alert('Failed to load the saved quiz. Please try again.');
    }
}

async function updateRecentQuizzes() {
    const cachedQuizzes = await loadCachedQuizzes();
    const recentQuizzesContainer = document.getElementById('recent-quizzes');
    
    if (recentQuizzesContainer) {
        recentQuizzesContainer.innerHTML = '';
        
        if (cachedQuizzes.length === 0) {
            recentQuizzesContainer.innerHTML = '<p>No recent quizzes found</p>';
            return;
        }
        
        // Create a list of recent quizzes
        const quizList = document.createElement('div');
        quizList.className = 'recent-quiz-list';
        
        // The quizzes should already be sorted by the server, but we'll sort them again just to be sure
        // Sort by timestamp in descending order (newest first)
        const sortedQuizzes = [...cachedQuizzes].sort((a, b) => b.timestamp - a.timestamp);
        
        // Only show up to 10 most recent quizzes (increased from 5)
        const recentQuizzes = sortedQuizzes.slice(0, 10);
        
        recentQuizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.className = 'recent-quiz-item';
            
            // Format date
            const date = new Date(quiz.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            quizItem.innerHTML = `
                <div class="quiz-info">
                    <span class="quiz-title">${quiz.title}</span>
                    <span class="quiz-type">${quiz.type === 'regular' ? 'Regular Quiz' : 'Code Quiz'}</span>
                    <span class="quiz-date">${formattedDate}</span>
                </div>
                <button class="load-quiz-btn" data-id="${quiz.id}">Load Quiz</button>
            `;
            
            quizList.appendChild(quizItem);
        });
        
        recentQuizzesContainer.appendChild(quizList);
        
        // Add event listeners to the load buttons
        document.querySelectorAll('.load-quiz-btn').forEach(button => {
            button.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = recentQuizzes.find(q => q.id === parseInt(quizId) || q.id === quizId);
                if (quiz) {
                    loadQuizFromServerData(quiz);
                }
            });
        });
    }
}

// This function loads the cached quizzes from the server
// No changes needed here, assuming the server returns sorted quizzes
async function loadCachedQuizzes() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'success') {
            return result.data || [];
        } else {
            console.error('Server returned error:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error loading quizzes from server:', error);
        return [];
    }
}

// Function to save quiz to server
// This calls the updated API that checks for duplicates
async function cacheQuiz(jsonData) {
    try {
        const parsedData = JSON.parse(jsonData);
        const quizTitle = parsedData.title || "Untitled Quiz";
        
        const payload = {
            title: quizTitle,
            type: currentQuizType,
            data: jsonData
        };
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'success') {
            // Update the UI
            updateRecentQuizzes();
            return true;
        } else {
            console.error('Server returned error:', result.message);
            return false;
        }
    } catch (error) {
        console.error('Error saving quiz to server:', error);
        return false;
    }
}