<?php
  // ini_set('display_errors', 1);
  // ini_set('display_startup_errors', 1);
  // error_reporting(E_ALL);
  setcookie('key', 'value', ['samesite' => 'None', 'secure' => true]);
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
  $db_name_statistics = getenv('DB_NAME_STATISTICS');
  $tracking_page_name = getenv('TRACKING_PAGE_NAME');
  $game_server = 'mysql:dbname=' . $db_name . ';host=' . $host;
  $stats_server = 'mysql:dbname=' . $db_name_statistics . ';host=' . $host;

  // Connect to db
  try {
      $pdo = new PDO($game_server, $user, $password);
  } catch (PDOException $e) {
      echo 'Connection failed. Please try again later.';
      exit; // Exit to avoid further script execution on connection failure
  }

  try {
      $pdo_statistics = new PDO($stats_server, $user, $password);
  } catch (PDOException $e) {
      echo 'Connection failed. Please try again later.';
      exit; // Exit to avoid further script execution on connection failure
  }

  // Info about the visitor
  if(isset($_SERVER['HTTP_REFERER'])) 
  {
    $ref=$_SERVER['HTTP_REFERER'];
  }
  else
  {
    $ref= "Unknown";
  }
  $agent=$_SERVER['HTTP_USER_AGENT'];
  $ip=$_SERVER['REMOTE_ADDR'];
  $domain = gethostbyaddr($_SERVER['REMOTE_ADDR']);
  $vstr = $pdo_statistics->prepare("INSERT INTO tracking_info(tm, ref, agent, ip, tracking_page_name, domain)  VALUES(curdate(), :ref, :agent, :ip, :tracking_page_name, :domain)");
  $vstr->execute(array(':ref'=>$ref, ':agent'=>$agent, ':ip'=>$ip, ':tracking_page_name'=>$tracking_page_name, ':domain'=>$domain));

  if (!$vstr) {
    echo "\nPDO::errorInfo():\n";
    print_r($pdo_statistics->errorInfo());
  }
  
  // Create highscores table
  $slct = $pdo->prepare("SELECT * from (SELECT * from highscores order by score desc) x group by name order by score desc LIMIT 5");
  $slct->execute();
  $scores = $slct->fetchAll();

  $table = "<table style='border-style: ridge;padding: 1px;''>
            <tr>
                <th>Name</td>
                <th>Monsters Killed</td>
            </tr>";
  foreach ($scores as $score) {
    $table .= "<tr>
                  <td>".$score['name']."</td>
                  <td>".$score['score']."</td>
              </tr>";
  }
  $table .= "</table>";  
?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0>
    <style type="text/css">
      body{
        background: #e8dddc;
        width: 100%;
        height: 100%;
        margin: 0!important;
      }
      h1, h2 {
        display: inline;
      }
      table {
          font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
      }

      table td, table th {
          border: 1px solid #ddd;
          padding: 2px;
      }

      table tr:nth-child(even){background-color: #f2f2f2;}

      table tr:hover {background-color: #ddd;}

      table th {
          padding-top: 3px;
          padding-bottom: 3px;
          text-align: left;
          background-color: #4CAF50;
          color: white;
      }
      canvas {
        margin-top: 75px!important;
      }
      /* The Modal (background) */
      .modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: rgb(0,0,0); /* Fallback color */
          background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
      }

      /* The Close Button */
      .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
      }

      .close:hover,
      .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
      }
      /* Modal Header */
      .modal-header {
          padding: 2px 16px;
          background-color: dodgerblue;
          color: white;
      }

      /* Modal Body */
      .modal-body {padding: 2px 16px;}

      /* Modal Footer */
      .modal-footer {
          padding: 2px 16px;
          background-color: dodgerblue;
          color: white;
      }

      /* Modal Content */
      .modal-content {
          position: relative;
          background-color: #fefefe;
          padding: 0;
          border: 1px solid #888;
          margin-top: 20%;
          margin-bottom: 20%;
          margin-left: 35%;
          margin-right: 35%;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
          animation-name: animatetop;
          animation-duration: 0.4s
      }
      .button {
        display: inline-block;
        padding: 10px 15px;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        outline: none;
        color: #fff;
        background-color: lightslategrey;
        border: none;
        border-radius: 15px;
      }

      .button:hover {background-color: LightSkyBlue }

      .button:active {
        background-color: LightSkyBlue ;
        box-shadow: 0 5px #666;
        transform: translateY(4px);
      }

      /* Add Animation */
      @keyframes animatetop {
          from {top: -300px; opacity: 0}
          to {top: 0; opacity: 1}
      }
    </style>
    <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous">
    </script>

  <script src="addons/p5.min.js"></script>
  <script src="addons/p5.dom.min.js"></script>
  <script src="addons/p5.sound.min.js"></script>
  <script src="js/monster.js"></script>
  <script src="js/player.js"></script>
  <script src="js/bullet.js"></script>
  <script src="js/sketch.js"></script>



  </head>
  <body>
    <center>
      <h2 style="display: inline-block;color: dodgerblue">RETRO SHOOTER</h2><br>
      <b>Speed: </b> <b id="speed" style="color: red">1</b> 
    </center>
    <div style="display:inline;width: 100%;height: 250px;top: 10px;position: absolute;"> 
      <div style="float: left;margin-left: 5%;color: forestgreen">
        <h3>Move Mouse to aim.<br>Hit "s" to shoot.<br>Press ESC to pause and resume.</h3>
      </div>
      <div style="float: right;margin-right: 2%;border-style: ridge;padding: 1px;">
        <h2> Monsters Killed: <b id="score" style="color:red">0</b></h2>
      </div>
      <div style="float: right;margin-right: 5%;">
        <b>Leaderboard</b>
        <?=$table;?>
      </div>
  </div>
  <div style="position: absolute;bottom: 0;width: 100%;height:30px;background-color: #004080;">
    <div style="position: absolute;bottom: 0;right: 35px;padding: 5px;color: #6d6ddf">
      Made by <span style="color: #91a8ee;">drkostas</span>. Source code available on <a href="https://github.com/drkostas/shooter-game-with-p5js" target="_blank" style="color: #999">GitHub</a>
    </div>
  </div>

  <div id="submitScore" class="modal">
    <div class="modal-content" >
      <div class="modal-header">
        <span class="close">&times;</span>
        <center>
          <h2>Your score: <span id="scoreModal" style="color: red;margin-right: 10px"></span>  Submit?</h2><br>
          <b style="color:rgba(255, 0, 0, 0.7);font-size: 12px;">(You will see your score after refreshing the page)</b>
          </center>
      </div>
      <div class="modal-body">
        <center>
          <p style="color: dodgerblue">Your Name:</p>
          <input type="text" style="font-size: 25px;" id="playerName">  
        </center>    
        <br>  
      </div>
      <div class="modal-footer">
        <center>
          <button class="button" style="background: rgb(173, 12, 12);width: 83px;" onclick="noSubmit();">NO</button>
          <button class="button" style="background:rgb(41, 173, 11);margin-right: 30px;width: 83px;" onclick="submitScore();">SUBMIT</button>
        </center>
      </div>
    </div>
  </div>

  </body>
  <script type="text/javascript">
    // Get the modal
    var modal = document.getElementById('submitScore');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        resumeGame();
    }

    function submitScore(){
      let name = $('#playerName').val();
      $.ajax({
        url:"api/submit_score.php",
        type:"POST",
        data:({
                name: name,
                score: highScore
              }),
        success: function(data) {
          modal.style.display = "none";
          resumeGame();
          }
      });
    }
    function noSubmit(){
      modal.style.display = "none";
      resumeGame();
    }
  </script>
</html>