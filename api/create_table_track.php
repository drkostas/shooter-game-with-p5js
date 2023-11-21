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
  $tracking_page_name = getenv('TRACKING_PAGE_NAME');

  try {
      $pdo = new PDO($game_server, $user, $password);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch (PDOException $e) {
      error_log($e->getMessage());
      echo 'Connection failed. Please try again later.';
      exit;
  }

  // Info about the visitor
  $ref = $_SERVER['HTTP_REFERER'] ?? "Unknown";
  $agent = $_SERVER['HTTP_USER_AGENT'];
  $ip = $_SERVER['REMOTE_ADDR'];
  $domain = gethostbyaddr($_SERVER['REMOTE_ADDR']);

  $vstr = $pdo->prepare("INSERT INTO tracking_info (tm, ref, agent, ip, tracking_page_name, domain) VALUES (CURDATE(), :ref, :agent, :ip, :tracking_page_name, :domain)");

  try {
      $vstr->execute([':ref' => $ref, ':agent' => $agent, ':ip' => $ip, ':tracking_page_name' => $tracking_page_name, ':domain' => $domain]);
  } catch (PDOException $e) {
      error_log($e->getMessage());
      echo "\nError occurred while tracking info.";
  }
?>
