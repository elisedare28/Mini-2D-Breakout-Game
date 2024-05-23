const canvas = document.getElementById("newCanvas");

const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 2.5;
let dy = -2.5;
const ballRadius = 10;
let ballColor = "#FF00FF";

function drawBall() {

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, Math.PI * 2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

const paddleHeight = 10;
const paddleWidth = 60;
let paddleX = (canvas.width - paddleWidth) / 2;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        changeBallColor();
    }
        
    if(y + dy < ballRadius) {
        dy = -dy;
        changeBallColor();
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                clearInterval(interval);
                changeButton();
                ctx.font = "16px Arial"
                ctx.fillStyle = "#000000";
                ctx.fillText(`Game Over!    Score: ${score}`, canvas.width / 3, canvas.height / 1.5);
                
            } else {
                x = canvas.width / 2;
                y = canvas.height / 2;
                dx = 2.5;
                dy = -2.5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
        
    x += dx;
    y += dy;

    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    }
    else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
}

let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDown(K) {
    if(K.key === "Right" || K.key === "ArrowRight" || K.key === "d") {
        rightPressed = true;
    }
    else if(K.key === "Left" || K.key === "ArrowLeft" || K.key === "a") {
        leftPressed = true;
    }
}

function keyUp(K) {
    if(K.key === "Right" || K.key === "ArrowRight" || K.key === "d") {
        rightPressed = false;
    }
    else if(K.key === "Left" || K.key === "ArrowLeft" || K.key === "a") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
  

const brickRowCount = 3;
const brickColCount = 6;
const brickWidth = 65;
const brickHeight = 30;
const brickPadding = 10;
const brickTopOffset = 30;
const brickLeftOffset = 20;

const bricks = [];
for(let c = 0 ; c < brickColCount ; c++) {
    bricks[c] = [];
    for(let r = 0 ; r < brickRowCount ; r++) {
        bricks[c][r] = {x: 0 , y: 0, status: 1};
    }
}
function drawBricks() {
    for(let c = 0 ; c < brickColCount ; c++) {
        for( let r = 0; r < brickRowCount ; r++) {
            if(bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickLeftOffset;
                const brickY = r * (brickHeight + brickPadding) + brickTopOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;            
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = ballColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    
}

function collisionDetection() {
    for(let c = 0 ; c < brickColCount ; c++) {
        for( let r = 0; r < brickRowCount ; r++) {
            const b = bricks[c][r];
            if(b.status === 1)
            {   
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
                if(score === brickColCount * brickRowCount) {
                    setTimeout(() => {
                    ctx.font = "16px Arial"
                    ctx.fillStyle = "#000000";
                    ctx.fillText(`You Win!    SCORE: ${score}`, canvas.width / 3, canvas.height / 2);
                    clearInterval(interval);
                    changeButton();
                    }, 20);
                    
                }
            }
        }
    }
}

let score = 0;
function drawScore()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

let lives = 3;
function drawLives() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#000000";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 70, 20);
}

function changeButton() {
    document.getElementById("startButton").innerHTML = "Reset";
    startButton.disabled = false;
    startButton.removeEventListener("click", startGame);
    startButton.addEventListener("click", resetGame);
}

function startGame() {
    interval = setInterval(draw, 10);
    document.getElementById("startButton").disabled = true;
}

function resetGame() {
    document.location.reload();
    clearInterval();
}

function changeBallColor() {
    const red = Math.floor(Math.random() * 128);
    const green = Math.floor(Math.random() * 128);
    const blue = Math.floor(Math.random() * 128);
    const randomColor = "#" + (red * 65536 + green * 256 + blue).toString(16).padStart(6, "0");
    ballColor = randomColor;
}

document.getElementById("startButton").addEventListener("click", function() {
    startGame();
    this.disabled = true;
});





