# Interactive Quiz App

A web application that allows users to create and take quizzes using JSON input. Built with vanilla JavaScript, HTML, CSS, with simple file-based server-side storage.

## Features

- JSON-based quiz creation
- Instant feedback on answers
- Confetti animation for correct answers
- Score tracking
- Responsive design
- Support for multiple questions and answers
- **Server-side quiz storage** allowing access across devices
- Recent quizzes list for quickly accessing saved quizzes
- Automatic cleanup of quizzes older than 15 days

## Usage

1. Visit the app at: [konnorkooi.com/quiz-app](http://konnorkooi.com/quiz-app)
2. Use the following JSON format to create a quiz:

```json
{
    "title": "My Sample Quiz",
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
7. Your quiz will be automatically saved to the server and appear in the "Recent Quizzes" section
8. Quizzes are automatically removed after 15 days of inactivity

## Server Requirements

- Apache web server with PHP 7.2+ support
- PHP with json extension enabled

## File Storage

This application uses a simple file-based storage system:
- Quizzes are stored as JSON files in the `quiz_files` directory
- Each quiz has a unique ID and timestamp
- Files older than 15 days are automatically deleted
- No database setup required

## API Endpoints

The app uses a simple REST API for quiz storage:

- `GET /quiz-app/api/quizzes.php` - Retrieves all saved quizzes
- `POST /quiz-app/api/quizzes.php` - Saves a new quiz

## Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd quiz-app
```

2. Create the quiz_files directory:
```bash
mkdir -p quiz_files
chmod 755 quiz_files
```

3. Serve the files locally using PHP:
```bash
php -S localhost:3000
```

4. Visit `http://localhost:3000` in your browser

## Deployment

1. Upload files to your web server:
```bash
scp -r ./* username@yourserver.com:/var/www/yoursite.com/quiz-app/
```

2. Create required directories:
```bash
ssh username@yourserver.com "mkdir -p /var/www/yoursite.com/quiz-app/api"
ssh username@yourserver.com "mkdir -p /var/www/yoursite.com/quiz-app/quiz_files"
```

3. Upload the PHP API file:
```bash
scp api/quizzes.php username@yourserver.com:/var/www/yoursite.com/quiz-app/api/
```

4. Set proper permissions:
```bash
ssh username@yourserver.com "chmod -R 755 /var/www/yoursite.com/quiz-app"
ssh username@yourserver.com "chmod -R 777 /var/www/yoursite.com/quiz-app/quiz_files"
```

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - Quiz logic and interactions
- `api/quizzes.php` - Server-side API for quiz storage
- `quiz_files/` - Directory for storing saved quizzes
- `AWSquiz1.json` - Sample AWS quiz
- `design-patterns-quiz.json` - Sample design patterns quiz

## License

MIT License