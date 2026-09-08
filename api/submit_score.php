<?php
//   ini_set('display_errors', 1);
//   ini_set('display_startup_errors', 1);
//   error_reporting(E_ALL);
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

	// Scores go to the collector at home over HTTPS. No database credentials live in this app.
	$collector = rtrim(getenv('COLLECTOR_URL') ?: '', '/');
	$token = getenv('COLLECTOR_TOKEN') ?: '';

	$name = $_POST['name'] ?? 'defaultName';
	$score = filter_var($_POST['score'] ?? 0, FILTER_VALIDATE_INT);
	$name = substr(strip_tags($name), 0, 80);

	if ($score === false || $score < 0) {
		http_response_code(400);
		echo 'Invalid score.';
		return;
	}
	if (!$collector || !$token || !function_exists('curl_init')) {
		error_log('collector not configured');
		echo 'Error occurred while submitting the score.';
		return;
	}

	$ch = curl_init($collector . '/highscores');
	curl_setopt_array($ch, array(
		CURLOPT_POST           => true,
		CURLOPT_POSTFIELDS     => json_encode(array('name' => $name, 'score' => $score)),
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT_MS     => 2500,
		CURLOPT_NOSIGNAL       => true,
		CURLOPT_USERAGENT      => 'estate-collector-client/1.0',
		CURLOPT_HTTPHEADER     => array('Content-Type: application/json',
		                                'Authorization: Bearer ' . $token),
	));
	$body = @curl_exec($ch);
	$code = @curl_getinfo($ch, CURLINFO_HTTP_CODE);
	@curl_close($ch);

	if ($code === 200) {
		echo "success";
	} else {
		error_log('collector highscore submit returned ' . $code);
		echo 'Error occurred while submitting the score.';
	}

?>
