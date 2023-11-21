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
  $slct = $pdo->prepare("SELECT * from (SELECT * from highscores order by score desc) x group by name order by score desc LIMIT 100");
  $slct->execute();
  $scores = $slct->fetchAll();

  $table = "<table style='border-style: ridge;padding: 1px;''>
            <tr>
                <th>Name</td>
                <th>Monsters Killed</td>
            </tr>";
  foreach ($scores as $score) {
    $table .= "<tr>
                    <td class='name-cell'>".$score['name']."</td>
                    <td class='score-cell'>".$score['score']."</td>
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

      table th {
        font-size: 12px;
      }

      table td {
        font-size: 10px;
      }
      table td.name-cell {
        max-width: 200px; /* Adjust the max-width as needed */
        white-space: nowrap; /* Keep the text in a single line */
        overflow: hidden; /* Hide text that goes beyond the max-width */
        text-overflow: ellipsis; /* Add an ellipsis at the end of the hidden text */
      }

      table td.score-cell {
        max-width: 50px; /* Adjust the max-width as needed */
        white-space: nowrap; /* Keep the text in a single line */
        overflow: hidden; /* Hide text that goes beyond the max-width */
        text-overflow: ellipsis; /* Add an ellipsis at the end of the hidden text */
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
          margin-top: 75px;
          flex-grow: 1;
          z-index: 2;
          position: relative;
          }

      /* Adjust the leaderboard style */
      #leaderboard {
        /* max-width: 10%; Adjust the width as necessary */
        position: relative;
        right: 0; /* Keep a small distance from the right edge of the screen */
        top: 10px; /* Adjust this value based on the position of the 'Monsters Killed' text */
        z-index: 1; /* Ensure it's under the game canvas */
        float: right;
        margin-right: 1%;
        padding: 1px;
        height: calc(100vh - 280px);
      }

      /* The Modal (background) */
      .modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 3; /* Sit on top */
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
    <div id="header">
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
      </div>

      <div id="center-page">
        <div id="game-container">
        </div>
        <div id="leaderboard">
          <b>Leaderboard</b>
          <?=$table;?>
        </div>
      </div>
  </div>

  <div id="footer" style="position: absolute;bottom: 0;width: 100%;height:30px;background-color: #004080;">
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
    function adjustTableHeight() {
      // Get the leaderboard and footer elements
      const leaderboard = document.getElementById('leaderboard');
      const footer = document.getElementById('footer');

      // Calculate the available height for the leaderboard table
      const leaderboardTop = leaderboard.getBoundingClientRect().top;
      const footerTop = footer.getBoundingClientRect().top;
      const availableHeight = footerTop - leaderboardTop;

      // Get the height of a single row - assumes all rows are of equal height
      const rowHeight = leaderboard.querySelector('tr').clientHeight;

      // Calculate the max number of rows that fit in the available space
      const maxRows = Math.floor(availableHeight / rowHeight);

      // Get all the rows in the leaderboard table
      const rows = leaderboard.querySelectorAll('tr');

      // Hide rows that don't fit in the available space
      rows.forEach((row, index) => {
        if (index > maxRows - 1) { // -1 because index is 0-based and we want to include the first row
          row.style.display = 'none';
        } else {
          row.style.display = ''; // Ensure that the first maxRows are shown
        }
      });
    }

    // Run the function on load and on window resize
    window.onload = adjustTableHeight;
    window.onresize = adjustTableHeight;

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
        url:"api/submit_score",
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