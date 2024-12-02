# Quiz App Deployment Guide

## Local Setup
First, ensure you have all your files in a local directory:
```bash
mkdir quiz-app
cd quiz-app
touch index.html styles.css script.js
```

Copy the provided HTML, CSS, and JavaScript code into their respective files.

## Deployment to Server

### Option 1: Using SCP
From your local quiz-app directory:
```bash
# Copy all files to the server
scp -r ./* konnor@76.135.164.17:/var/www/konnorkooi.com/quiz-app/
```

If the directory doesn't exist yet, first create it:
```bash
# Create directory on server
ssh konnor@76.135.164.17 "mkdir -p /var/www/konnorkooi.com/quiz-app"

# Then copy files
scp -r ./* konnor@76.135.164.17:/var/www/konnorkooi.com/quiz-app/
```



### Set Permissions
After copying, set the correct permissions:
```bash
ssh konnor@76.135.164.17 "chmod -R 755 /var/www/konnorkooi.com/quiz-app"
```

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
```

2. Check Apache configuration:
```bash
ssh konnor@76.135.164.17 "sudo apache2ctl -S"
```

3. Check Apache error logs:
```bash
ssh konnor@76.135.164.17 "sudo tail -f /var/log/apache2/error.log"
```