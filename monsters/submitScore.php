<?php
	$name = $_POST['name']; 
	$score = $_POST['score'];
	$server = 'mysql:dbname=XXX;host=XXX';
	$user = 'XXX';
	$password = 'XXX';
	try {
	  $pdo = new PDO($server, $user, $password);
	} catch (PDOException $e) {
	  echo 'Connection failed: ' . $e->getMessage();
	}
	$insrt = $pdo->prepare("INSERT INTO highscores (name, score) VALUES (:nm, :scr)");
	$insrt -> bindParam(':nm', $name);
	$insrt -> bindParam(':scr', $score);
	$insrt->execute(); 
	echo "success";
?>