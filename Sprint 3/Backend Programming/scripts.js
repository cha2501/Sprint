const start = document.querySelector('.controls button[name="start"]'),
      cards = document.querySelectorAll('.memory-card'),
      scoreBoard = document.querySelector('.controls .score span')
      highScoreList = document.querySelector('#highScores')
      score = 0,
      NO_OF_HIGH_SCORES = 10
      highScores = JSON.parse(localStorage.getItem('highScores')) || [];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard, playTime;


start.addEventListener('click', startGame);

function startGame() {
  playTime = 50;
  scoreBoard.textContent = 0;
  score = 0;

  cards.forEach(card => card.addEventListener('click', flipCard));
  countdown();
}

function scorePoint() {
  score+=2;
  scoreBoard.textContent = score;

  if(score === 12){
    checkHighScore(score);
    showHighScores();
    clearInterval(interval);
    cards.forEach(card => card.addEventListener('click', flipCard));
  }
}

function countdown() {
  const timer = document.querySelector('.timer');

  interval = setInterval(() => {
    if (playTime < 0) {
      checkHighScore(score);
      showHighScores();
      clearInterval(interval);
      cards.forEach(card => card.addEventListener('click', flipCard));
      return;
    }

    timer.textContent = playTime;
    playTime--;
  }, 1000);
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if(isMatch === true){
      scorePoint();
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}


function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function showHighScores() {
  highScoreList.innerHTML = highScores.map((score) => `<li>${score.score} - ${score.name}`).join('');
}

function checkHighScore(score) {
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    const name = prompt('You got a highscore! Enter name:');
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
}

(function shuffle() {
  cards.forEach(card => {let randomPos = Math.floor(Math.random() * 12);card.style.order = randomPos;});
})();


