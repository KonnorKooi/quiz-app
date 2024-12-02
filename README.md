# Interactive Quiz App

A simple web application that allows users to create and take quizzes using JSON input. Built with vanilla JavaScript, HTML, and CSS.

## Features

- JSON-based quiz creation
- Instant feedback on answers
- Confetti animation for correct answers
- Score tracking
- Responsive design
- Support for multiple questions and answers

## Usage

1. Visit the app at: [konnorkooi.com/quiz-app](http://konnorkooi.com/quiz-app)
2. Use the following JSON format to create a quiz:

```json
{
    "questions": [
        {
            "question": "What is the capital of France?",
            "options": ["London", "Berlin", "Paris", "Madrid"],
            "correctAnswer": 2
        },
        {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Venus", "Mars", "Jupiter", "Saturn"],
            "correctAnswer": 1
        }
    ]
}
```

3. Paste your JSON into the input field
4. Click "Start Quiz" to begin
5. Select your answers and use the "Next Question" button to progress
6. View your final score at the end

## Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd quiz-app
```

2. Serve the files locally using Python:
```bash
python3 -m http.server 3000
```

Or using Node.js:
```bash
npx http-server
```

3. Visit `http://localhost:3000` in your browser

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - Quiz logic and interactions

## License

MIT License