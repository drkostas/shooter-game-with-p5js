<?php
// For testing the code locally
// Run php -S localhost:8000 router.php
$path = $_SERVER['REQUEST_URI'];

// Check if the file exists and is not a directory
if (file_exists(__DIR__ . $path) && !is_dir(__DIR__ . $path)) {
    // Serve the file directly
    return false;
} else {
    // Include your index.php file
    include_once 'api/index.php';
}
?>
