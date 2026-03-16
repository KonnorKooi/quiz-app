<?php
// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// File storage settings
$storage_dir = __DIR__ . '/../quiz_files';
$archive_dir = __DIR__ . '/../quiz_files_archive'; // Archive for old quizzes
$max_age_days = 90; // Auto-archive files older than this (3 months)

// Create storage directory if it doesn't exist
if (!file_exists($storage_dir)) {
    mkdir($storage_dir, 0755, true);
}

// Create archive directory if it doesn't exist
if (!file_exists($archive_dir)) {
    mkdir($archive_dir, 0755, true);
}

// Archive old files (older than max_age_days)
cleanupOldFiles($storage_dir, $archive_dir, $max_age_days);

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Simple mock user ID for testing (could be replaced with session-based ID later)
$userId = "test_user_123";

// Handle different request methods
switch ($method) {
    case 'GET':
        // Get all quizzes for the user
        $quizzes = [];
        $files = glob($storage_dir . "/{$userId}_*.json");
        
        foreach ($files as $file) {
            $content = file_get_contents($file);
            if ($content) {
                $data = json_decode($content, true);
                if ($data) {
                    $quizzes[] = $data;
                }
            }
        }
        
        // Sort quizzes by timestamp in descending order (newest first)
        usort($quizzes, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });
        
        echo json_encode(['status' => 'success', 'data' => $quizzes]);
        break;

    case 'POST':
        // Add a new quiz
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!isset($data['title']) || !isset($data['type']) || !isset($data['data'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
            exit;
        }

        // Get the parsed quiz data to extract the title
        $quizData = json_decode($data['data'], true);
        if (!$quizData || !isset($quizData['title'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid quiz data or missing title']);
            exit;
        }

        // Sanitize title for use in filename
        $sanitizedTitle = sanitizeFilename($quizData['title']);
        if (empty($sanitizedTitle)) {
            $sanitizedTitle = 'untitled-quiz';
        }
        
        // Create filename based on user ID and sanitized title
        $filename = "{$userId}_{$sanitizedTitle}.json";
        $filepath = $storage_dir . '/' . $filename;
        
        $timestamp = time() * 1000; // JavaScript-style timestamp
        
        // Check if this quiz already exists (by filename)
        if (file_exists($filepath)) {
            // Update the existing quiz with new timestamp
            $existingQuiz = json_decode(file_get_contents($filepath), true);
            $existingQuiz['timestamp'] = $timestamp; // Update last taken timestamp
            $existingQuiz['data'] = $data['data']; // Update data in case it changed
            $existingQuiz['type'] = $data['type']; // Update type in case it changed

            // Keep the original created timestamp if it exists, otherwise set it now
            if (!isset($existingQuiz['created'])) {
                $existingQuiz['created'] = $timestamp;
            }

            $saved = file_put_contents($filepath, json_encode($existingQuiz));

            if ($saved !== false) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Quiz updated',
                    'id' => $existingQuiz['id']
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update quiz file'
                ]);
            }
        } else {
            // Create quiz data structure with title as ID
            $quizData = [
                'id' => $sanitizedTitle,
                'title' => $quizData['title'],
                'type' => $data['type'],
                'data' => $data['data'],
                'created' => $timestamp,
                'timestamp' => $timestamp
            ];
            
            // Save to file
            $saved = file_put_contents($filepath, json_encode($quizData));
            
            if ($saved !== false) {
                echo json_encode([
                    'status' => 'success', 
                    'message' => 'Quiz saved', 
                    'id' => $sanitizedTitle
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error', 
                    'message' => 'Failed to save quiz file'
                ]);
            }
        }
        break;
        
    case 'DELETE':
        // Optional: Implement delete functionality to remove specific quizzes
        // For simplicity, we're deleting all quizzes for the test user
        $files = glob($storage_dir . "/{$userId}_*.json");
        $count = 0;
        
        foreach ($files as $file) {
            if (unlink($file)) {
                $count++;
            }
        }
        
        echo json_encode([
            'status' => 'success', 
            'message' => $count
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}

/**
 * Archive files older than specified days
 * Moves old files to archive directory instead of deleting them
 */
function cleanupOldFiles($dir, $archive_dir, $days) {
    $cutoff = time() - ($days * 24 * 60 * 60);
    $files = glob($dir . "/*.json");

    foreach ($files as $file) {
        if (filemtime($file) < $cutoff) {
            $filename = basename($file);
            $archive_path = $archive_dir . '/' . $filename;

            // If a file with the same name exists in archive, add timestamp
            if (file_exists($archive_path)) {
                $pathinfo = pathinfo($filename);
                $archive_path = $archive_dir . '/' . $pathinfo['filename'] . '_' . time() . '.' . $pathinfo['extension'];
            }

            // Move file to archive instead of deleting
            rename($file, $archive_path);
        }
    }
}

/**
 * Sanitize a string for use in a filename
 */
function sanitizeFilename($string) {
    // Replace spaces with hyphens
    $string = str_replace(' ', '-', $string);
    
    // Remove special characters that aren't suitable for filenames
    $string = preg_replace('/[^A-Za-z0-9\-_]/', '', $string);
    
    // Convert to lowercase
    $string = strtolower($string);
    
    // Limit length to avoid very long filenames
    $string = substr($string, 0, 50);
    
    return $string;
}
?>