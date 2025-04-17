const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const spaceship = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 80,
    width: 70, 
    height: 90, 
    speed: 7, 
    image: new Image()
};
spaceship.image.src = "ship.png";

const bullets = [];
const asteroids = [];
const asteroidSpeed = 2;
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && spaceship.x > 0) {
            spaceship.x -= spaceship.speed;
        }
        if (e.key === "ArrowRight" && spaceship.x + spaceship.width < canvas.width) {
            spaceship.x += spaceship.speed;
        }
        if (e.key === " " || e.key === "ArrowUp") {
            bullets.push({ x: spaceship.x + 30, y: spaceship.y, speed: 7 });
        }
    }
});

// Game Loop
function update() {
    if (score >= 150) {
        gameOver = true;
    }

    if (gameOver) return; 

    // moving the bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // generating asteroids
    if (Math.random() < 0.02) {
        asteroids.push({ x: Math.random() * (canvas.width - 40), y: -40, width: 40, height: 40 });
    }

    // to move asteroids
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y += asteroidSpeed;
        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
        }
    }

    //checking if the bullet hit the asteroid
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < asteroids.length; j++) {
            if (
                bullets[i].x < asteroids[j].x + asteroids[j].width &&
                bullets[i].x + 5 > asteroids[j].x &&
                bullets[i].y < asteroids[j].y + asteroids[j].height &&
                bullets[i].y + 10 > asteroids[j].y
            ) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        setTimeout(() => {
            window.open("victory.html", "_self");
        }, 300);
        return;
    }

    ctx.drawImage(spaceship.image, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    ctx.fillStyle = "white";
    bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });

    asteroids.forEach((asteroid) => {
        let asteroidImg = new Image();
        asteroidImg.src = "asteroid.png"; 
        ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillStyle = "cyan";
    ctx.font = "40px Century Gothic";
    ctx.fillText("Destroy 15 Asteroids to win!", 130, 70);
    ctx.fillStyle = "lightgray";
ctx.font = "20px Century Gothic";
ctx.fillText("Use arrow keys to move left and right, and space to shoot", 110, 100);
     
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
