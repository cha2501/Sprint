const start = document.querySelector('.controls button[name="start"]'),
      cards = document.querySelectorAll('.memory-card'),
      scoreBoard = document.querySelector('.controls .score span');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard, playTime;
let score = 0;

start.addEventListener('click', startGame);


function startGame() {
  playTime = 70;
  scoreBoard.textContent = 0;
  score = 0;

  if(score == 24){
    playTime = startGame;
  }

  cards.forEach(card => card.addEventListener('click', flipCard));
  countdown();
}

function scorePoint() {
  score+=2;
  scoreBoard.textContent = score;
}

function countdown() {
  const timer = document.querySelector('.timer');

  interval = setInterval(() => {
    if (playTime < 0) {
      clearInterval(interval);
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

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 24);
    card.style.order = randomPos;
  });
})();

