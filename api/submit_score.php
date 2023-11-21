<?php
	// Load Env Variables
	if (file_exists(__DIR__ . '/../.env')) {
		$lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		foreach ($lines as $line) {
			if (strpos(trim($line), '#') === 0) continue;
			list($name, $value) = explode('=', $line, 2);
			$_ENV[$name] = $value;
			putenv("$name=$value");
		}
	}

	$host = getenv('DB_HOST');
	$user = getenv('DB_USER');
	$password = getenv('DB_PASSWORD');
	$db_name = getenv('DB_NAME');
	$game_server = 'mysql:dbname=' . $db_name . ';host=' . $host;

	try {
	$pdo = new PDO($game_server, $user, $password);
	// It's a good practice to set the error mode to exception
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $e) {
	// Log the error internally instead of echoing it
	error_log($e->getMessage());
	echo 'Connection failed. Please try again later.';
	exit; // Exit to avoid further script execution on connection failure
	}

	// Assuming $name and $score come from POST request
	$name = $_POST['name'] ?? 'defaultName'; // Replace 'defaultName' with a suitable default
	$score = $_POST['score'] ?? 0;

	// Validate and sanitize inputs
	$name = filter_var($name, FILTER_SANITIZE_STRING);
	$score = filter_var($score, FILTER_VALIDATE_INT);

	$insrt = $pdo->prepare("INSERT INTO highscores (name, score) VALUES (:nm, :scr)");
	$insrt->bindParam(':nm', $name);
	$insrt->bindParam(':scr', $score);

	try {
	$insrt->execute();
	echo "success";
	} catch (PDOException $e) {
	// Log the error internally instead of echoing it
	error_log($e->getMessage());
	echo 'Error occurred while submitting the score.';
	}
?>
