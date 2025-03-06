<?php
$test_file = '../quiz_files/test_write.php';
$result = file_put_contents($test_file, '<?php echo "Write test successful"; ?>');
if ($result === false) {
    echo "Write failed: " . error_get_last()['message'];
} else {
    echo "Write successful ($result bytes)";
}
?>
