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
    cdShoot = 15
    const shoot = new Shoot(idShoot, paddle.x + 50, paddle.y)
    idShoot++
    shootTable.push(shoot);
  }
  if (cdShoot != 0) {
    cdShoot -= 1
  }
}

//---------------------------------------------------------CRÉATION DES BRIQUES-----------------------------------------------------------//
const brick = {
  row: 4,
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

//-------------------------------------------COLLISION DE LA BALLE / BRIQUES--------------------------------------------------------------//
function shootBrickCollision() {
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 6; j++) {
      for (let k = 0; k < shootTable.length; k++) {
        let toucheBrique = false
        if (shootTable[k].cooY < bricks[i][j].y + brick.height) {
          if (shootTable[k].cooX > bricks[i][j].x && shootTable[k].cooX < bricks[i][j].x + brick.width) {
            toucheBrique = true
          }
          if (shootTable[k].cooX + 4 > bricks[i][j].x && shootTable[k].cooX + 4 < bricks[i][j].x + brick.width) {
            toucheBrique = true
          }
          if (toucheBrique) {
            console.log("détruit")
          }
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