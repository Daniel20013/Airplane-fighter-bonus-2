const plane = document.querySelector(".plane");
let score = document.getElementById("score");
let seconds = 0, minutes = 0, hours = 0;
let timerID;
let obstaclesIntervalID;
let puncture = 0;
let gameOver = document.querySelector(".gameOver");
let appearanceTime = 1500;
let moveDistance = 52;
let clones = [];

function collisionObjects(projectile) {
    const rect1 = projectile.getBoundingClientRect();
    for (let i = 0; i < clones.length; ++i) {
        const rect2 = clones[i].getBoundingClientRect();
        if (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        ) {
            console.log("impact");
            ++puncture;
            clones[i].remove();
            projectile.remove();
        }
    }
}

function objection() {
    const containerObstacles = document.querySelector(".containerObstacles");
    let clone = document.createElement("img");
    clone.src = "assets/airplane_u2708_icon_256x256.png";
    clone.classList.add("obstacles");
    clone.style.left = Math.floor((86 - 1 + 1) * Math.random()) + "%";
    clone.style.display = "block";
    containerObstacles.appendChild(clone);
    clones.push(clone);
    setTimeout (function() {
        clone.classList.add("down");
        setInterval (function() {
            checkCollision(clone);
        }, 100);
        setTimeout (function() {
            clone.remove();
        }, 5000);
    }, 100);
}

function pad(value) {
    return value.toString().padStart(2, "0");
}

function checkCollision(clone) {
    const rect1 = clone.getBoundingClientRect();
    const rect2 = plane.getBoundingClientRect();
    if (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    ) {
        score.textContent = "Score: " + puncture;
        gameOver.style.display = "block";
        seconds = 0;
        minutes = 0;
        hours = 0;
        clearInterval(timerID);
        clearInterval(obstaclesIntervalID);
        plane.style.display = "none";
    }
}

function modifyAppearanceTime() {
    if (appearanceTime >= 300) {
        appearanceTime -= 150;
    }
    clearInterval(obstaclesIntervalID);
    obstaclesIntervalID = setInterval(objection, appearanceTime);
}

function release() {
    const containerProjectile = document.querySelector(".containerProjectile");
    let projectile = document.createElement("img");
    projectile.src = "assets/Projectile.png";
    projectile.classList.add("projectile");
    projectile.style.left = (moveDistance + 2) + "%";
    projectile.style.top = 89 + "%";
    projectile.style.height = "2rem";
    projectile.style.display = "block";
    containerProjectile.appendChild(projectile);
    setTimeout(function() {
        projectile.classList.add("up");
        setInterval (function() {
            collisionObjects(projectile);
        }, 100);
        setTimeout(function() {
            projectile.remove();
        }, 2800);
    }, 100);
}

function startTimer() {
    timerID = setInterval(function() {
        ++seconds;
        if (seconds === 60) {
            seconds = 0;
            ++minutes;
        }
        if (minutes === 60) {
            minutes = 0;
            ++hours;
        }
        if (seconds % 10 === 0) {
            modifyAppearanceTime();
        }
        let time = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
        document.getElementById("timer").textContent = time;
    }, 1000);
    obstaclesIntervalID = setInterval (objection, appearanceTime);
}

function startGame() {
    startTimer();
    let timer = document.getElementById("timer");
    timer.style.display = "block";
    let start = document.getElementById("start");
    start.style.display = "none";
    plane.style.display = "block";
    document.addEventListener('keydown', function(event) {
        if (event.key === "d" || event.key === "D") {
            moveDistance += 5;
            if (moveDistance < 95) {
                plane.style.left = moveDistance + "%";
            } else {
                moveDistance -= 5;
            }
        } else if (event.key === "a" || event.key === "A") {
            moveDistance -= 5;
            if (moveDistance >= 0) {
                plane.style.left = moveDistance + "%";
            } else {
                moveDistance += 5;
            }
        }
        if (event.key === " ") {
            release();
        }
    });
}

function restartGame() {
    startTimer();
    plane.style.display = "block";
    gameOver.style.display = "none";
    puncture = 0;
    appearanceTime = 1500;
    clearInterval(obstaclesIntervalID);
    obstaclesIntervalID = setInterval(objection, appearanceTime);
    moveDistance = 52;
    plane.style.left = moveDistance + "%";
}
