// ────────────────────────────────────────────────────────── I ──────────
//   :::::: V A R I A B L E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────
const score = document.querySelector("#score");
const level = document.querySelector("#level");
const bgAudio = document.querySelector("#bgAudio");
const boardSpeed = document.querySelector("#speed");
const gameArea = document.querySelector(".gameArea"); //! 1st MAIN
const hiScoreSet = localStorage.getItem("highScore");
const hiScoreDiv = document.querySelector("#hiScore");
const scoreBroad = document.querySelector("#scoreBroad");
const startScreen = document.querySelector(".startScreen");
const endGameAudio = document.querySelector("#endGameAudio");
const hiScoreBroad = document.querySelector("#hiScoreBroad");

let gameKeys = {
  KeyW: false,
  KeyS: false,
  KeyA: false,
  KeyD: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  Space: false,
};

const player = {
  // DEFAULT VALUES
  speed: 10,
  score: 0,
  speedEndPoint: 18,
  speedUp: 10,
  level: 0,
  levelUp: true,
};
// ──────────────────────────────────────────────────────────────────────── II
//   :::::: D E F I N E I N G   E V E N T S : :  :   :    :     :        :      ──────────────────────────────────────────────────────────────────────────────────
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
startScreen.addEventListener("click", gameStart);

// ──────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: D E F I N E I N G   F U N C T I O N : :  :   :    :              :──────────────────────────────────────────────────────────────────────────────

// ─── GETING HIGH SCORE AND SAVE IN LOCAL STORAGE ────────────────────────────────
if (hiScoreSet === null) {
  let hiscoreVal = 0;
  localStorage.setItem("highScore", hiscoreVal);
} else {
  hiscoreVal = hiScoreSet;
  hiScoreDiv.innerHTML = `high score: ${hiscoreVal}`;
}

// ─── GETING KEYS ────────────────────────────────────────────────────────────────
function keyDown(e) {
  e.preventDefault;
  gameKeys[e.code] = true;
  // console.log(e.code);    // RETURN THE ALL VALUE AND METHOD. RELATED TO KEYS
}

function keyUp(e) {
  e.preventDefault;
  gameKeys[e.code] = false;
  // console.log(e); // RETURN THE ALL VALUE AND METHOD. RELATED TO KEYS
}

// ──────────────────────────────────────────────────────────────────────────────────── IV ──────────
//   :::::: 1st B A S E   F U N C T I O N   F O R   G A M E : :  :   :    :      ──────────────────────────────────────────────────────────────────────────────────────────────

function gameStart() {
  // ─── WHEN GAME START TO PLAYING
  player.start = true;
  bgAudio.src = "assets/audio/bg.mp3";
  bgAudio.play();
  bgAudio.loop = true;
  bgAudio.currentTime = 0;
  gameArea.innerHTML = ""; // ─── FOR ELEMENT NOT CREATE DABALS
  startScreen.classList.add("hideClass");
  window.requestAnimationFrame(gamePlay); // FOR CONTINUSLY LOOP AND FPS

  // ───   CREATING, ADDING CLASS AND INSERT PLAYERCAR DIV.────────────────────────────────────────────────────────────────────────
  let playerCar = document.createElement("div");
  playerCar.setAttribute("class", "playerCar");
  gameArea.appendChild(playerCar);

  // ─── FINDING PLAYERCAR POSITION BY OFFSET ─────────────────────────────────────────────
  player.X = playerCar.offsetLeft;
  player.Y = playerCar.offsetTop;

  // ─── CREATING ,ADDING CLASS AND INSERTING ROADLINE DIV    __________________________________________________________________________
  for (i = 0; i <= 9; i++) {
    let roadLines = document.createElement("div");
    roadLines.setAttribute("class", "lines");
    roadLines.Y = i * 180;
    roadLines.style.top = roadLines.Y + "px";
    gameArea.appendChild(roadLines);
  }

  // ─── CREATING ,ADDING CLASS AND INSERTING OTHERCARS DIV    __________________________________________________________________________
  for (x = 0; x <= 2; x++) {
    // FOR 3 CARS
    let otherCars = document.createElement("div");
    otherCars.setAttribute("class", "otherCars");
    otherCars.Y = (x + 1) * 250 * -1; // USEING IN MOVEOTHERCAR()
    gameArea.appendChild(otherCars);
  }
}

// ──────────────────────────────────────────────────────────────────────────────────────────── V ──────────
//   :::::: 2 E D   B A S E   F U N C T I O N   F O R   G A M E : :  :   :   ──────────────────────────────────────────────────────────────────────────────────────────────────────

function gamePlay() {
  // ─── INCREASING CAR SPEED ────────────────────────────────────────────────────────
  let playerCar = document.querySelector(".playerCar"); // RETURN THE WHOLE DIR

  let gaPositions = gameArea.getBoundingClientRect(); // RETURN THE WHOLE POSITION OF GAMEAREA.
  let pcPositions = playerCar.getBoundingClientRect();

  if (player.start) {
    //! 2ed MAIN
    moveLine(); // FUNCTION FOR MOVEING ROADLINES
    moveOtherCar(pcPositions); //  FUNCTION FOR MOVEING OTHERCARS

    // ─ ─── MOVEING CAR BY KEYS AND SET THE LIMIT OF CAR AREA ─────────────────────────────────────────
    if (
      (gameKeys.KeyW || gameKeys.ArrowUp) &&
      gaPositions.top < pcPositions.top - 155
    ) {
      player.Y -= player.speed;
    } else if (
      (gameKeys.KeyS || gameKeys.ArrowDown) &&
      gaPositions.bottom > pcPositions.bottom + 20
    ) {
      player.Y += player.speed;
    } else if (
      (gameKeys.KeyA || gameKeys.ArrowLeft) &&
      gaPositions.left < pcPositions.left - 30
    ) {
      player.X -= player.speed;
    } else if (
      (gameKeys.KeyD || gameKeys.ArrowRight) &&
      gaPositions.right > pcPositions.right + 30
    ) {
      player.X += player.speed;
    }

    // ─── WHEN UPWORD CONDITION IS TRUE, CAR IS MOVE ─────────────────────────────────────────────────────────────────────
    playerCar.style.top = `${player.Y}px`;
    playerCar.style.left = `${player.X}px`;

    window.requestAnimationFrame(gamePlay); // ! IMPORTENT

    // ─── INCREASING SCORE AND SET ────────────────────────────────────
    let currentScore = player.score++;
    score.innerText = "score: " + currentScore;

    // ─── SET HIGH SCORE WHEN SCORE IN GREATER ────────────────────────
    if (currentScore > hiscoreVal) {
      // CONDITION IS HERE BECOUSE THE VALUE OF CURRENTSCORE IS HERE
      hiscoreVal = currentScore;
      localStorage.setItem("highScore", hiscoreVal);
      hiScoreDiv.innerHTML = `high score: ${hiscoreVal}`;
    }

    if (!player.start) {
      scoreBroad.innerText = `your score: ${currentScore}`;
      hiScoreBroad.innerText = `your high score: ${hiscoreVal}`;
      player.score = 0;
    }

    // ─── INCREASING SPEED FOR PLAYERCAR AND OTHERCARS ────────────────
    increaseSpeed(currentScore);
  }
}

// ──────────────────────────────────────────────────── IV───────── ::::::FUNCTION FOR ANIMATION, collaging, RANDOM CARS AND ROADLINES : :  ──────────────────────────────────────────────────────────────

// ─── FOR ROADLINE MOVEING ─────────────────────────────────────────
function moveLine() {
  let roadlines = document.querySelectorAll(".lines");
  roadlines.forEach((value) => {
    if (value.Y >= 900) {
      // REPEATING ROADLINE AT A POINT
      value.Y -= 900;
    }
    value.Y += player.speed; // FOR SPEED OF LINE
    value.style.top = value.Y + "px"; // MAKE DISTANCE IN EACH LINES INTO TOP
  });
}

// ────── FOR OTHERCARS MOVING ────────────────────────────────────────
function moveOtherCar(playerCar) {
  let otherCars = document.querySelectorAll(".otherCars");

  otherCars.forEach((value) => {
    if (collaging(playerCar, value)) {
       gameOver();
    } else if (value.Y >= 900) {
      value.Y -= 900;
      //  FOR OTHER CAR REMDOW POSITIONS
      value.style.left = Math.floor(Math.random() * 99) + 1 + "%";
    }
    value.Y += player.speed;
    value.style.top = value.Y + "px";
  });
}

// ────── INCREASING SPEED WHEN SCORE DIFFIRENT 100 ───────────────────
function increaseSpeed(speed) {
  let count = String(speed.toString()).substr(-2);
  if (count == 99) {
    player.speed += 0.5;
  }
  if (player.speed == player.speedEndPoint) {
    player.speed = player.speedUp;
    player.speedUp += 1;
    player.speedEndPoint += 1;
    player.level += 1;
  }
  level.innerText = `Level: ${player.level}`;
  boardSpeed.innerText = `Speed: ${player.speed}`;
}
// ────── FUNCTION FOR FINDING collaging BETWEEN PLAYERCAR AND OTHERCARS
function collaging(pcPositions, otherCars) {
  let otherCar = otherCars.getBoundingClientRect();

  return !(
    pcPositions.right < otherCar.left ||
    pcPositions.bottom < otherCar.top ||
    pcPositions.top > otherCar.bottom ||
    pcPositions.left > otherCar.right
  );
}
// ─── ─── WHEN GAME IS OVER ────────────────────────────────────────────────────
function gameOver() {
  player.start = false;
  player.speed = 10;
  player.level = 0;
  bgAudio.pause();
  endGameAudio.play();
  startScreen.classList.remove("hideClass");
}
