'use strict';

// variables and elements
const gameMenu = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gameScreen = document.querySelector('.game-screen');
const winScreen = document.querySelector('.win-screen');
const gamePanel = document.querySelector('.game-panels');

const buttonStartGame = document.getElementById('button-start-game');
const buttonRestartGame = document.getElementById('button-restart');
const buttonNextLevel = document.getElementById('button-next-level');

const gunman = document.querySelector('.gunman');
const gunmanTimePanel = document.querySelector('.time-panel__gunman');
const playerTimePanel = document.querySelector('.time-panel__you');

const gunmanStyles = window.getComputedStyle(gunman);
const timeValues = [1500, 1300, 1000, 700, 400];
let playerCounter = 0;
let timerInterval = null;
let currentLevel = 1;

const levelEnemies = [
    'gunman-level-1',
    'gunman-level-2',
    'gunman-level-3',
    'gunman-level-4',
    'gunman-level-5'
];

// Audio
const intro = new Audio('../sfx/intro.m4a');
const wait = new Audio('../sfx/wait.m4a');
const win = new Audio('../sfx/win.m4a');
const fire = new Audio('../sfx/fire.m4a');
const shoot = new Audio('../sfx/shot.m4a');
const shootFall = new Audio('../sfx/shot-fall.m4a');
const foul = new Audio('../sfx/foul.m4a');
const death = new Audio('../sfx/death.m4a');

let gunFight = false;
let gameActive = false;
let currentTimeout = null;

function startGame() {
    console.log(gunmanStyles.getPropertyValue('left'));
    clearAllTimeouts();
    resetStyles();
    
    gameActive = true;
    gameMenu.style.display = 'none';
    wrapper.style.display = 'block';
    gamePanel.style.display = 'block';
    gameScreen.style.display = 'block';
    winScreen.style.display = 'none';
    buttonRestartGame.style.display = 'none';
    gunmanTimePanel.textContent = `${Number.parseFloat(timeValues[currentLevel-1]/1000).toPrecision(3)}`;
    playerTimePanel.textContent = '0.00';
    playerCounter = 0;

    currentTimeout = setTimeout(() => {
        gunman.classList.add(levelEnemies[currentLevel-1]);
        moveGunman();
    }, 50);
    
    intro.play();
}

function clearAllTimeouts() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetStyles() {
    gunFight = false;
    gameActive = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    playerTimePanel.textContent = '0.00';
    playerCounter = 0;

    gunman.classList.remove(
        levelEnemies[currentLevel-1] + '',
        levelEnemies[currentLevel-1] + '__standing',
        levelEnemies[currentLevel-1] + '__ready',
        levelEnemies[currentLevel-1] + '__shooting',
        levelEnemies[currentLevel-1] + '__death',
        'moving',
        'moving-reverse',
        'standing'
    );
    
    const allAudio = [intro, wait, win, fire, shoot, shootFall, foul, death];
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function restartGame() {
    console.log(gunmanStyles.getPropertyValue('left'));
    startGame();
}

function nextLevel() {
    currentLevel++;
    buttonNextLevel.style.display = 'none';
    console.log(gunmanStyles.getPropertyValue('left'));
    restartGame();
}

function moveGunman() {
    currentTimeout = setTimeout(() => {
        gunman.classList.add('moving');
    }, 200);

    currentTimeout = setTimeout(() => {
        if (gameActive) {
            gunman.classList.remove('moving');
            prepareForDuel();
        }
    }, 5000);
}

function gunFightStart() {
    if (!gameActive) return;
    
    gunFight = true;
    gunman.classList.add(levelEnemies[currentLevel-1] + '__ready');
    fire.play();

    currentTimeout = setTimeout(() => {
        if (gameActive) {
            gunman.classList.remove(levelEnemies[currentLevel-1] + '__ready');
            gunman.classList.add(levelEnemies[currentLevel-1] + '__shooting');
        }
    }, 200);

    timeCounter();
}

function prepareForDuel() {
    if (!gameActive) return;
    
    gunman.classList.add(
        'standing', 
        levelEnemies[currentLevel-1] + '__standing'
    );
    playAudioTwice(wait);

    currentTimeout = setTimeout(() => {
        if (gameActive) {
            gunman.classList.remove(levelEnemies[currentLevel-1] + '__standing');
            gunFightStart();
        }
    }, 4000);
}

function playAudioTwice(audio) {
    audio.currentTime = 0;
    audio.play();

    audio.addEventListener('ended', function handler() {
        audio.removeEventListener('ended', handler);
        audio.currentTime = 0;
        audio.play();
    });
}

function timeCounter() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    playerCounter = 0;
    playerTimePanel.innerText = '0.00';
    
    timerInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(timerInterval);
            timerInterval = null;
            return;
        }
        
        playerCounter += 0.01;
        playerTimePanel.innerText = `${Number.parseFloat(playerCounter).toPrecision(3)}`;

        if (playerCounter >= timeValues[currentLevel-1]/1000) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            if (gameActive) {
                gunmanShootsPlayer();
            }
        }
    }, 10);
}

function gunmanShootsPlayer() {
    if (!gameActive) return;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    shoot.play();
    death.play();
    
    buttonRestartGame.style.display = 'block';
    gameActive = false;
    gunFight = false;
}

function playerShootsGunman() {
    if (!gameActive) return;
    
    clearAllTimeouts();
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    gunman.classList.remove(levelEnemies[currentLevel-1] + '__ready');
    gunman.classList.remove(levelEnemies[currentLevel-1] + '__shooting');

    if (gunFight) {
        console.log(gunmanStyles.getPropertyValue('left'));
        shootFall.play();
        currentTimeout = setTimeout(() => {
            gunman.classList.add(levelEnemies[currentLevel-1] + '__death');
        }, 200);

        currentTimeout = setTimeout(() => {
            win.play();
            buttonNextLevel.style.display = 'block';
            gameActive = false;
        }, 1000);
    }
    else {
        console.log(gunmanStyles.getPropertyValue('left'));
        foul.play();
        gunman.classList.add('moving-reverse');
        buttonRestartGame.style.display = 'block';
        gameActive = false;
    }

    gunFight = false;
}

function scoreCount() {
    // Add score counting functionality here
}

buttonStartGame.addEventListener('click', startGame);
buttonRestartGame.addEventListener('click', restartGame);
buttonNextLevel.addEventListener('click', nextLevel);
gunman.addEventListener('click', playerShootsGunman);