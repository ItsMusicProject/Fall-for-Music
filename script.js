// References
const startBtn = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const game = document.getElementById('game');
const player = document.getElementById('player');
const popup = document.getElementById('popup');
const popupContent = document.querySelector('.popup-content');
const obstacleContainer = document.getElementById('obstacle-container');

// Game data
const levelQuotes = [
  { quote: "You did it! But it’s just the beginning.", level: 1 },
  { quote: "Falling teaches us how to fly.", level: 2 },
  { quote: "Not everything that falls is broken.", level: 3 },
  { quote: "Even stars fall… before they shine again.", level: 4 },
  { quote: "Down is not defeat. It's setup for the rise.", level: 5 }
];

let currentLevel = 0;
let fallingSpeed = 2;
let playerY = 10;
let gameInterval;
let isPlaying = false;

// Start Game
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  startLevel();
});

function startLevel() {
  isPlaying = true;
  resetPlayer();
  generateObstacles(currentLevel);
  gameInterval = setInterval(gameLoop, 20);
}

// Game Loop
function gameLoop() {
  if (!isPlaying) return;

  playerY += fallingSpeed;
  player.style.top = playerY + 'px';

  // Check for bottom screen
  if (playerY >= window.innerHeight - 60) {
    completeLevel();
  }

  checkCollision();
}

// Move Player
document.addEventListener('keydown', e => {
  const left = parseInt(player.style.left || '50%');
  if (e.key === 'ArrowLeft') movePlayer(-20);
  if (e.key === 'ArrowRight') movePlayer(20);
});

document.addEventListener('touchmove', e => {
  const touchX = e.touches[0].clientX;
  const percent = (touchX / window.innerWidth) * 100;
  player.style.left = percent + '%';
});

function movePlayer(offset) {
  const left = player.offsetLeft + offset;
  const maxLeft = game.offsetWidth - player.offsetWidth;
  player.style.left = Math.max(0, Math.min(maxLeft, left)) + 'px';
}

// Obstacle Generator
function generateObstacles(level) {
  obstacleContainer.innerHTML = '';
  const number = 5 + level;
  for (let i = 0; i < number; i++) {
    const obs = document.createElement('div');
    obs.style.top = (100 + i * 120) + 'px';
    obs.style.left = Math.random() * (game.offsetWidth - 100) + 'px';
    obstacleContainer.appendChild(obs);
  }
}

// Collision Check
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacles = obstacleContainer.querySelectorAll('div');

  obstacles.forEach(obs => {
    const obsRect = obs.getBoundingClientRect();
    if (
      playerRect.bottom > obsRect.top &&
      playerRect.top < obsRect.bottom &&
      playerRect.left < obsRect.right &&
      playerRect.right > obsRect.left
    ) {
      endGame("You hit an obstacle! Try again.");
    }
  });
}

// Level Complete
function completeLevel() {
  isPlaying = false;
  clearInterval(gameInterval);
  currentLevel++;

  if (currentLevel < levelQuotes.length) {
    showPopup(levelQuotes[currentLevel - 1].quote);
  } else {
    showPopup("You’ve completed all levels! More coming soon...");
  }
}

// Reset player
function resetPlayer() {
  playerY = 10;
  player.style.top = playerY + 'px';
  player.style.left = '50%';
}

// Show motivational popup
function showPopup(message) {
  popup.style.display = 'flex';
  popupContent.innerHTML = `
    <h2>Level ${currentLevel} Complete</h2>
    <p>${message}</p>
    <div class="popup-buttons">
      <button onclick="nextLevel()">Next</button>
      <button onclick="skip()">Skip</button>
    </div>
  `;
}

// Continue
function nextLevel() {
  popup.style.display = 'none';
  startLevel();
}

// Skip
function skip() {
  popup.style.display = 'none';
  currentLevel++;
  if (currentLevel >= levelQuotes.length) {
    endGame("You skipped all levels. Game Over.");
  } else {
    startLevel();
  }
}

// End Game
function endGame(message) {
  isPlaying = false;
  clearInterval(gameInterval);
  popup.style.display = 'flex';
  popupContent.innerHTML = `
    <h2>Game Over</h2>
    <p>${message}</p>
    <div class="popup-buttons">
      <button onclick="restartGame()">Restart</button>
    </div>
  `;
}

// Restart
function restartGame() {
  currentLevel = 0;
  popup.style.display = 'none';
  startLevel();
}
