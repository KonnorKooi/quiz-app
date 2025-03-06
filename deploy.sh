#!/bin/bash

# Quiz App Deployment Script
# Usage: ./deploy.sh [server_address] [username] [web_path]
# Example: ./deploy.sh 76.135.164.17 konnor /var/www/konnorkooi.com/quiz-app

# Default values - change these to match your setup
SERVER=${1:-"76.135.164.17"}
USER=${2:-"konnor"}
WEB_PATH=${3:-"/var/www/konnorkooi.com/quiz-app"}

echo "⚙️ Starting Quiz App deployment to $USER@$SERVER:$WEB_PATH..."

# 1. Create necessary directories
echo "📁 Creating necessary directories..."
ssh $USER@$SERVER "mkdir -p $WEB_PATH/api"
ssh $USER@$SERVER "mkdir -p $WEB_PATH/quiz_files"

# 2. Set initial permissions for quiz_files directory
echo "🔐 Setting initial permissions for quiz_files directory..."
ssh $USER@$SERVER "chmod 777 $WEB_PATH/quiz_files"

# 3. Deploy files - preserve quiz_files directory
echo "🚀 Deploying files (preserving existing quizzes)..."
ssh $USER@$SERVER "find $WEB_PATH -not -path '$WEB_PATH/quiz_files*' -type f -delete"
scp -r ./* $USER@$SERVER:$WEB_PATH/

# 4. Set proper permissions
echo "🔒 Setting proper permissions..."
ssh $USER@$SERVER "chmod -R 755 $WEB_PATH"
ssh $USER@$SERVER "chmod -R 777 $WEB_PATH/quiz_files"

# 5. Verify deployment
echo "✅ Verifying deployment..."

# Check if API file exists
API_CHECK=$(ssh $USER@$SERVER "if [ -f $WEB_PATH/api/quizzes.php ]; then echo 'exists'; else echo 'missing'; fi")
if [ "$API_CHECK" == "exists" ]; then
    echo "  ✓ API file is present"
else
    echo "  ✗ API file is missing!"
fi

# Check write permissions
WRITE_CHECK=$(ssh $USER@$SERVER "sudo -u www-data touch $WEB_PATH/quiz_files/test_write.txt && echo 'success' || echo 'failed'")
if [ "$WRITE_CHECK" == "success" ]; then
    echo "  ✓ Write permissions are correct"
    ssh $USER@$SERVER "rm -f $WEB_PATH/quiz_files/test_write.txt"
else
    echo "  ✗ Write permission test failed!"
fi

# 6. restart Apache
echo "🔄 Restarting Apache..."
ssh $USER@$SERVER "sudo systemctl restart apache2"
echo "  ✓ Apache restarted"

echo ""
echo "🎉 Deployment completed!"
echo "📊 Your Quiz App should be available at: http://konnorkooi.com/quiz-app"
echo ""
echo "🔍 If you encounter issues:"
echo "  - Check Apache error logs: ssh $USER@$SERVER \"sudo tail -f /var/log/apache2/error.log\""
echo "  - Test API endpoint: curl http://konnorkooi.com/quiz-app/api/quizzes.php"
echo "  - Verify file permissions: ssh $USER@$SERVER \"ls -la $WEB_PATH/quiz_files\""