// Game constants
let inputDir = { x: 0, y: 0 };
let speed = 6;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = [
    { x: 6, y: 7, class: 'food1' },
    { x: 4, y: 5, class: 'food2' },
    { x: 10, y: 2, class: 'food3' },
    { x: 15, y: 8, class: 'food4' },
    { x: 16, y: 17, class: 'food5' }
];
let score = 0;
let hiscoreval = localStorage.getItem("hiscore") || 0;

// DOM elements
const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const countdownEl = document.getElementById('countdown');

// Initialize hi-score display
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 20 || snake[0].x <= 0 || snake[0].y >= 20 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Update snake array
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
    }

    // Check if snake eats any food
    food.forEach((f, index) => {
        if (snakeArr[0].x === f.x && snakeArr[0].y === f.y) {
            snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
            score += 1;
            scoreBox.innerHTML = "Score: " + score;
            
            if (score > hiscoreval) {
                hiscoreval = score;
                localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
                hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
            }

            // Move food to a new random position
            food[index] = {
                x: Math.floor(Math.random() * 18) + 2,
                y: Math.floor(Math.random() * 18) + 2,
                class: f.class
            };
        }
    });

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Render the snake and food
    board.innerHTML = "";

    // Display the snake
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    food.forEach(f => {
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = f.y;
        foodElement.style.gridColumnStart = f.x;
        foodElement.classList.add(f.class);
        board.appendChild(foodElement);
    });
}

// Game logic
window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) {
                inputDir = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (inputDir.y === 0) {
                inputDir = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) {
                inputDir = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (inputDir.x === 0) {
                inputDir = { x: 1, y: 0 };
            }
            break;
    }
});

// Countdown timer
const startingMinutes = 1;
let time = startingMinutes * 60;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes} : ${seconds}`;
    time--;
    if (time < 0) {
        clearInterval(countdownInterval);
        countdownEl.innerHTML = '0 : 00';
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
