# Quiz App Deployment Guide

## Setup and Deployment

### Initial Server Setup

1. Create necessary directories:
```bash
ssh konnor@76.135.164.17 "mkdir -p /var/www/konnorkooi.com/quiz-app/api"
ssh konnor@76.135.164.17 "mkdir -p /var/www/konnorkooi.com/quiz-app/quiz_files"
```

2. Set proper permissions for file storage:
```bash
ssh konnor@76.135.164.17 "chmod 777 /var/www/konnorkooi.com/quiz-app/quiz_files"
```

### Deployment Using SCP

From your local quiz-app directory:
```bash
# Copy all files to the server
scp -r ./* konnor@76.135.164.17:/var/www/konnorkooi.com/quiz-app/
```

If you need to clean the directory first:
```bash
# Remove existing files (except quiz_files)
ssh konnor@76.135.164.17 "find /var/www/konnorkooi.com/quiz-app -not -path '/var/www/konnorkooi.com/quiz-app/quiz_files*' -type f -delete"

# Then copy files
scp -r ./* konnor@76.135.164.17:/var/www/konnorkooi.com/quiz-app/
```

### Set Permissions

After copying, set the correct permissions:
```bash
ssh konnor@76.135.164.17 "chmod -R 755 /var/www/konnorkooi.com/quiz-app"
ssh konnor@76.135.164.17 "chmod -R 777 /var/www/konnorkooi.com/quiz-app/quiz_files"
```

### Restart Apache (if needed)
```bash
ssh konnor@76.135.164.17 "sudo systemctl restart apache2"
```

## File Storage Notes

- The app uses a file-based storage system in the `quiz_files` directory
- All quiz files are stored as JSON files with unique IDs
- Files older than 15 days are automatically deleted
- Make sure PHP has write permissions to the quiz_files directory
- No database configuration is needed

## Verification

After deployment, your app should be accessible at:
```
http://konnorkooi.com/quiz-app
```

## Troubleshooting

If the app isn't accessible:

1. Check file permissions:
```bash
ssh konnor@76.135.164.17 "ls -la /var/www/konnorkooi.com/quiz-app"
ssh konnor@76.135.164.17 "ls -la /var/www/konnorkooi.com/quiz-app/quiz_files"
```

2. Check PHP errors:
```bash
ssh konnor@76.135.164.17 "sudo tail -f /var/log/apache2/error.log"
```

3. Test the API endpoint directly:
```bash
curl http://konnorkooi.com/quiz-app/api/quizzes.php
```

4. Verify API file is correctly placed:
```bash
ssh konnor@76.135.164.17 "cat /var/www/konnorkooi.com/quiz-app/api/quizzes.php | head -20"
```

5. Check if PHP can write to the directory:
```bash
ssh konnor@76.135.164.17 "sudo -u www-data touch /var/www/konnorkooi.com/quiz-app/quiz_files/test.txt"
```

### Restart apache if needed
sudo systemctl restart apache2



sudo chown -R www-data:www-data /var/www/konnorkooi.com/quiz-app/quiz_files
sudo chmod -R 755 /var/www/konnorkooi.com/quiz-app
sudo chmod -R 775 /var/www/konnorkooi.com/quiz-app/quiz_files