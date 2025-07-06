const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const paddleWidth = 16;
const paddleHeight = 100;
const ballRadius = 12;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Paddle positions
let leftPaddleY = (canvasHeight - paddleHeight) / 2;
let rightPaddleY = (canvasHeight - paddleHeight) / 2;

// Ball position and velocity
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

// Listen for mouse movement to control left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight / 2;
    // Clamp paddle within canvas
    leftPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftPaddleY));
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvasHeight; i += 30) {
        ctx.fillRect(canvasWidth/2 - 2, i, 4, 20);
    }
}

// Basic AI for right paddle
function moveAIPaddle() {
    const paddleCenter = rightPaddleY + paddleHeight/2;
    if (paddleCenter < ballY - 20) {
        rightPaddleY += 5;
    } else if (paddleCenter > ballY + 20) {
        rightPaddleY -= 5;
    }
    // Clamp within canvas
    rightPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, rightPaddleY));
}

// Collision detection
function collision(x, y, paddleX, paddleY, paddleW, paddleH) {
    return (
        x + ballRadius > paddleX &&
        x - ballRadius < paddleX + paddleW &&
        y + ballRadius > paddleY &&
        y - ballRadius < paddleY + paddleH
    );
}

// Reset ball to center
function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Main game loop
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    // Left paddle
    if (collision(ballX, ballY, 0, leftPaddleY, paddleWidth, paddleHeight)) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add some spin
        const collidePoint = (ballY - (leftPaddleY + paddleHeight/2)) / (paddleHeight/2);
        ballSpeedY = collidePoint * 5;
    }
    // Right paddle
    if (collision(ballX, ballY, canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        // Add some spin
        const collidePoint = (ballY - (rightPaddleY + paddleHeight/2)) / (paddleHeight/2);
        ballSpeedY = collidePoint * 5;
    }

    // Ball out of bounds (score)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvasWidth) {
        resetBall();
    }

    // Move AI paddle
    moveAIPaddle();
}

// Draw everything
function render() {
    // Clear
    drawRect(0, 0, canvasWidth, canvasHeight, "#111");
    // Net
    drawNet();
    // Left paddle
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "#00FF99");
    // Right paddle
    drawRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "#FF2052");
    // Ball
    drawCircle(ballX, ballY, ballRadius, "#FFD700");
}

// Game loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

game();