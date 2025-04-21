'use strict';





///////////////////////////
// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///////////////////////////





let level = 1;
let timeToDuel = Math.floor(Math.random() * 1000) + 100;
timeToDuel = 700;
let readyToDuel = 'false';
let time;
let score;
const startButton = document.querySelector('.button-start-game');
const restartButton = document.querySelector('.button-restart');
const nextButton = document.querySelector('.button-next-level');
const gameMenu = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gamePanels = document.querySelector('.game-panels');
const gameScreen = document.querySelector('.game-screen');
const winScreen = document.querySelector('.win-screen');
const gunman = document.querySelector('.gunman');
const timeYou = document.querySelector('.time-panel__you'); 
const timeGunman = document.querySelector('.time-panel__gunman'); 
const showLevel = document.querySelector('.score-panel__level'); 
const message = document.querySelector('.message');
let sfxIntro = new Audio('sfx/intro.m4a');
let sfxWait = new Audio('sfx/wait.m4a');
let sfxFire = new Audio('sfx/fire.m4a');
let sfxShot = new Audio('sfx/shot.m4a');
let sfxWin = new Audio('sfx/win.m4a');
let sfxDeath = new Audio('sfx/death.m4a');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
nextButton.addEventListener('click', nextLevel);

function startGame() {
    gameMenu.style.display = 'none';
    gamePanels.style.display = 'block';
    gameScreen.style.display = 'block';
    wrapper.style.display = 'block';
    timeGunman.innerHTML = (timeToDuel / 1000).toFixed(2);
    timeYou.innerHTML = (0).toFixed(2);
    score = +document.querySelector('.score-panel__score_num').innerHTML;
    showLevel.innerHTML = 'level: ' + level;
    gunman.classList.add('gunman-level-' + level);
    gunman.addEventListener('transitionend', prepareForDuel);
    setTimeout(function () {
       moveGunman();
    }, 500);
}

function restartGame() {
    sfxDeath.pause();
    restartButton.style.display = 'none';
    message.innerHTML = '';
    gameScreen.classList.remove('game-screen--death');
    message.classList.remove('message--dead');
    message.classList.remove('animated');
    message.classList.remove('zoomIn');
    gunman.classList.remove('gunman-level-' + level);
    gunman.classList.remove('gunman-level-' + level + '__standing');
    gunman.classList.remove('gunman-level-' + level + '__ready');
    gunman.classList.remove('gunman-level-' + level + '__shooting');
    gunman.classList.remove('moving-reverse');
    setTimeout(function () {
        startGame();
    }, 1000);
}

function nextLevel() {
    if (level < 5) {
        nextButton.style.display = 'none';
        message.innerHTML = '';
        message.classList.remove('message--win');
        message.classList.remove('animated');
        message.classList.remove('zoomIn');
        gunman.classList.remove('gunman-level-' + level);
        gunman.classList.remove('gunman-level-' + level + '__standing');
        gunman.classList.remove('gunman-level-' + level + '__death');
        level++;
        timeToDuel = 700;
        timeToDuel = timeToDuel - (level * 100);
        startGame();
    } else {
        message.style.display = 'none';
        gameScreen.style.display = 'none';
        gamePanels.style.display = 'none';
        winScreen.style.display = 'block';
    }
}

function moveGunman() {
    setTimeout(function () {
        gunman.classList.add('moving');
        sfxIntro.play();
        sfxIntro.loop = true;
    }, 50);
}

function prepareForDuel() {
    sfxIntro.pause();
    sfxWait.play();
    sfxWait.currentTime = 0;
    sfxWait.loop = true;
    gunman.classList.remove('moving');
    gunman.classList.add('standing');
    gunman.classList.add('gunman-level-' + level + '__standing');
    setTimeout(function () {
        sfxWait.pause();
        gunman.classList.add('gunman-level-' + level + '__ready');
        message.classList.add('message--fire');
        sfxFire.play();
        gunman.addEventListener('mousedown', playerShootsGunman);
        readyToDuel = true;
        timeCounter(new Date().getTime());
        setTimeout(gunmanShootsPlayer, timeToDuel);
    }, 1000);
}

function timeCounter(t) {
    let currTime;
    (function timeCompare() {
      currTime = new Date().getTime();
      if (readyToDuel) {
        time = ((currTime - t + 10) / 1000).toFixed(2);
        timeYou.innerHTML = time;
        setTimeout(timeCompare, 10);
      }
    })();
}

function gunmanShootsPlayer() {
    if (readyToDuel) {
        readyToDuel = false;
        gunman.classList.remove('standing');
        gunman.classList.add('gunman-level-' + level + '__shooting');
        setTimeout(function () {
            sfxShot.play();
            message.classList.remove('message--fire');
            gameScreen.classList.add('game-screen--death');
            message.classList.add('message--dead');
            message.classList.add('animated');
            message.classList.add('zoomIn');
            message.innerHTML = 'Had enough???';
        }, timeToDuel / 3);
        gunman.removeEventListener('mousedown', playerShootsGunman);
        setTimeout(function () {
            sfxDeath.play();
            restartButton.style.display = 'block';
        }, 1000);
    }
}

function playerShootsGunman() {
    if (readyToDuel) {
        readyToDuel = false;
        sfxShot.play();
        message.classList.remove('message--fire');
        gunman.classList.remove('standing');
        gunman.classList.remove('gunman-level-' + level + '__shooting');
        gunman.classList.add('gunman-level-' + level + '__death');
        gunman.removeEventListener('mousedown', playerShootsGunman);
        sfxWin.play();
        setTimeout(function () {
            message.classList.add('message--win');
            message.classList.add('animated');
            message.classList.add('zoomIn');
            message.innerHTML = 'You Win!';
            scoreCount();
            nextButton.style.display = 'block';
        }, 1000);
    } else {
        console.log(gunmanStyles.getPropertyValue('left'));
        foul.play();
        gunman.classList.add('moving-reverse');
        buttonRestartGame.style.display = 'block';
        gameActive = false;
    }
}

function scoreCount() {
    let scoreDiv = document.querySelector('.score-panel__score_num');
    
    let temp = +((+(timeToDuel / 1000) * 100 - +(+timeYou.innerHTML) * 100) * 100 * level).toFixed(0);
    
    (function count() {
      if (+scoreDiv.innerHTML - score < temp) {
        scoreDiv.innerHTML = +scoreDiv.innerHTML + 100;
        setTimeout(count, 10);
      }
    })();
}