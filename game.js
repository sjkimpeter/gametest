const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -15,  // 점프 높이
    jumpCount: 0,       // 점프 횟수 초기화
    maxJumps: 2,        // 최대 점프 횟수 (이단 점프 가능)
    onGround: false
};

let obstacles = [];
let score = 0;
let gameSpeed = 2;

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 60,
        width: 50,
        height: 50
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    // 땅에 닿았을 때 점프 카운트 초기화
    if (player.y + player.height >= canvas.height - 10) {
        player.y = canvas.height - player.height - 10;
        player.dy = 0;
        player.onGround = true;
        player.jumpCount = 0;  // 점프 횟수 초기화
    }
}

function handleObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            resetGame();
        }
    });

    if (Math.random() < 0.02) {
        spawnObstacle();
    }
}

function resetGame() {
    player.x = 50;
    player.y = canvas.height - 60;
    player.dy = 0;
    obstacles = [];
    score = 0;
    player.jumpCount = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function jump() {
    if (player.jumpCount < player.maxJumps) {  // 최대 점프 횟수 이하일 때 점프 가능
        player.dy = player.jumpStrength;
        player.onGround = false;
        player.jumpCount++;  // 점프 횟수 증가
    }
}

function gameLoop() {
    updatePlayer();
    handleObstacles();
    draw();
    requestAnimationFrame(gameLoop);
}

// 키보드 스페이스바 점프
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// 모바일 터치 점프
canvas.addEventListener('touchstart', () => {
    jump();
});

gameLoop();
