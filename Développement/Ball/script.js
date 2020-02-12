//----------------------------------------------------SÉLECTION DE L'ÉLÉMENT CANVAS-------------------------------------------------------//
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

//-----------------------------------------------------AJOUT DES BORDURES AU CANVAS-------------------------------------------------------//
cvs.style.border = "2px solid rgba(37, 204, 247,0.8)";

//---------------------------------------------------DESSIN DES LIGNES DANS LE CANVAS-----------------------------------------------------//
ctx.lineWidth = 2;

//----------------------------------------------------VARIABLES ET CONSTANTES DU JEU------------------------------------------------------//
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3; // le joueur possède 3 vies
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
let upPressed = false;
let shootTable = [];
let idShoot = 0;
let cdShoot = 20;


let statPaddle = {
  vitesseTir: 0,
  vitesseBase: 0,
  autres: 0
};

//--------------------------------------------------------SÉLECTION DES ÉLÉMENTS----------------------------------------------------------//
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

//---------------------------------------------------------CRÉATION DES CLASSES-----------------------------------------------------------//
/*class Brique {
	constructor (largeur, longueur, durabilite, proba_spawn, effet, proba_effet, x_pos, y_pos){
		this.largeur = largeur;
		this.longueur = longueur;
		this.durabilite = durabilite;
		this.proba_spawn = proba_spawn;
		this.effet = effet;
		this.proba_effet = proba_effet;
		this.x_pos = x_pos;
		this.y_pos = y_pos;
	}
}*/

/*class Paddle {
	constructor (credit, vitesse_tir, vitesse_deplacement, vitesse_defilement, x_pos, y_pos){
		this.credit = credit;
		this.vitesse_tir = vitesse_tir;
		this.vitesse_deplacement = vitesse_deplacement;
		this.vitesse_defilement = vitesse_defilement;
		this.x_pos = x_pos;
		this.y_pos = y_pos;
	}
}*/

class Shoot {
  constructor(id, cooX, cooY) {
    this.id = 0;
    this.cooX = cooX;
    this.cooY = cooY
  }
}

//-----------------------------------------------------------CRÉATION DU PADDLE-----------------------------------------------------------//
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5
}

//-----------------------------------------------------------DESSIN DU PADDLE-------------------------------------------------------------//
function drawPaddle() {
  ctx.fillStyle = "#2e3548";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = "#ffcd05";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//----------------------------------------------------------CONTROLE DU PADDLE------------------------------------------------------------//
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  }
  if (event.keyCode == 38) {
    upPressed = true;
  }
  if (event.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  }
  if (event.keyCode == 38) {
    upPressed = false;
  }
  if (event.keyCode == 39) {
    rightArrow = false;
  }
});

//---------------------------------------------------------MOUVEMENT DU PADDLE-----------------------------------------------------------//
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

//----------------------------------------------------------CRÉATION DES TIRS-------------------------------------------------------------//
function updateTirs() {
  for (let i = 0; i < shootTable.length; i++) {
    shootTable[i].cooY -= 10;
    ctx.fillStyle = "red"
    ctx.fillRect(shootTable[i].cooX, shootTable[i].cooY, 5, 10);
    if (shootTable[i].cooY < 0) {
      shootTable.splice(i, 1)
    }
  }
}

function createShoot() {
  if (upPressed == true && cdShoot == 0) {
    //console.log("test")
    cdShoot = 20
    // cdShoot = statPaddle.vitesseTir
    const shoot = new Shoot(idShoot, paddle.x + 50, paddle.y)
    console.log(shoot)
    idShoot++
    shootTable.push(shoot);


  }
  if (cdShoot != 0) {
    cdShoot -= 1
  }
}

// CRÉATION DE LA BALLE
/*const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 5,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3
}*/

// DESSIN DE LA BALLE
/*function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcd05";
  ctx.fill();

  ctx.strokeStyle = "#2e3548";
  ctx.stroke();

  ctx.closePath();
}

// MOUVEMENT DE LA BALLE
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// DÉTECTION COLLISION BALLES ET MURS
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }

  if (ball.y + ball.radius > cvs.height) {
    LIFE--; // LOSE LIFE
    LIFE_LOST.play();
    resetBall();
  }
}

// RESET DE LA BALLE
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

// COLLISION BALLES ET PADDLE
function ballPaddleCollision() {
  if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {

    // JOUER LE SON
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = collidePoint * Math.PI / 3;


    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}*/

//---------------------------------------------------------CRÉATION DES BRIQUES-----------------------------------------------------------//
const brick = {
  row: 1,
  column: 6,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#2e3548",
  strokeColor: "#FFF"
}

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
        status: true
      }
    }
  }
}

createBricks();

//----------------------------------------------------------DESSIN DES BRIQUES------------------------------------------------------------//
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // SI LA BRIQUE N'EST PAS CASSÉ
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// COLLISION DE LA BALLE / BRIQUES
/*function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false; // the brick is broken
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}*/

//------------------------------------------------------
function shootBrickCollision() {
  for (let ii = 0; ii < 1; ii++) {
    for (let jj = 0; jj < 6; jj++) {
      for (let kk = 0; kk < shootTable.length; kk++) {
        let toucheBrique = false
        if (shootTable[kk].cooY < bricks[ii][jj].y + brick.height) {
          if (shootTable[kk].cooX > bricks[ii][jj].x && shootTable[kk].cooX < bricks[ii][jj].x + brick.width) {
            toucheBrique = true
          }
          if (shootTable[kk].cooX + 4 > bricks[ii][jj].x && shootTable[kk].cooX + 4 < bricks[ii][jj].x + brick.width) {
            toucheBrique = true
          }
          if (toucheBrique) {
            console.log("detruit")
          }
          /*for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.column; c++) {
              let b = bricks[r][c];
              // if the brick isn't broken
              if (b.status) {
                if (shoot.x + shoot.radius > b.x && shoot.x - shoot.radius < b.x + brick.width && shoot.y + shoot.radius > b.y && shoot.y - shoot.radius < b.y + brick.height) {
                  // BRICK_HIT.play();
                  shoot.dy = -shoot.dy;
                  b.status = false; // the brick is broken
                  SCORE += SCORE_UNIT;
                }
              }
            }
          }*/
        }
      }
    }
  }
}



//---------------------------------------------------AFFICHER LES STATISTIQUES DU JEU-----------------------------------------------------//
function showGameStats(text, textX, textY, img, imgX, imgY) {
  // dessin du texte
  ctx.fillStyle = "#FFF";
  ctx.font = "25px Germania One";
  ctx.fillText(text, textX, textY);

  // dessin de l'image
  ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

//----------------------------------------------------------FONCTION DES DESSINS----------------------------------------------------------//
function draw() {
  drawPaddle();
  // drawBall();
  drawBricks();

  // AFFICHER LE SCORE
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  // AFFICHER LES VIES
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
  // AFFICHER LE NIVEAU
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

//------------------------------------------------------------FIN DU JEU------------------------------------------------------------------//
function gameOver() {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
}

//-----------------------------------------------------------NIVEAU SUPÉRIEUR-------------------------------------------------------------//
function levelUp() {
  let isLevelDone = true;

  // vérifier si toutes les briques sont cassées
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      GAME_OVER = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 2;
    resetBall();
    LEVEL++;
  }
}

//---------------------------------------------------METTRE À JOUR LES FONCTIONS DU JEU---------------------------------------------------//
function update() {
  movePaddle();
  // moveBall();
  // ballWallCollision();
  // ballPaddleCollision();
  // ballBrickCollision();
  shootBrickCollision();
  createShoot();
  updateTirs();
  gameOver();
  levelUp();
}

//-----------------------------------------------------------BOUCLE DE JEU----------------------------------------------------------------//
function loop() {
  // EFFACE LE CANVAS
  ctx.drawImage(BG_IMG, 0, 0);

  draw();

  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
loop();

//-----------------------------------------------------CHOISIR LES ÉLÉMENTS SONORES-------------------------------------------------------//
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
  // CHANGE L'IMAGE SON ON/OFF
  let imgSrc = soundElement.getAttribute("src");
  let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

  soundElement.setAttribute("src", SOUND_IMG);
  //---------------------------------------------------ACTIVE ET DÉSACTIVE LES SONS-------------------------------------------------------//
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// CLIQUEZ SUR LE BOUTON "PLAY AGAIN"
restart.addEventListener("click", function () {
  location.reload(); // recharge la page
})

//------------------------------------------------------MONTRE QUE VOUS AVEZ GAGNEZ-------------------------------------------------------//
function showYouWin() {
  gameover.style.display = "block";
  youwon.style.display = "block";
}

//------------------------------------------------------MONTRE QUE VOUS AVEZ PERDU--------------------------------------------------------//
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}