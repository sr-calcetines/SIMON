// Variables globales
let sequence = [];
let userSequence = [];
let speed = 1000;
let gameStarted = false;
let score = 0;

// Elementos DOM
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-btn');
const scoresButton = document.getElementById('scores-btn');
const speedInput = document.getElementById('speed');
const scoresModal = document.getElementById('scores-modal');
const closeModal = document.querySelector('.close');

// Event listeners
startButton.addEventListener('click', startGame);
scoresButton.addEventListener('click', showScores);
closeModal.addEventListener('click', closeScoresModal);
speedInput.addEventListener('input', updateSpeed);

// LÓGICA DEL JUEGO

// Inicializar el tablero de juego
function initializeGameBoard() {
    const colors = ['red', 'green', 'blue', 'yellow'];

    for (let i = 1; i <= 4; i++) {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color');
        colorDiv.dataset.color = i;
        colorDiv.id = `color${i}`;
        colorDiv.style.backgroundColor = colors[i - 1];
        gameBoard.appendChild(colorDiv);
    }
}

//Función que inicia el juego
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        sequence = [];
        userSequence = [];
        score = 0; // Reiniciar el puntuaje
        generateNextColor(); // Generar el primer color aleatorio
        setTimeout(() => {
            playSequence();
        }, 2000);
    }
}

// Función que genera la secuencia de colores aleatorios
function generateSequence() {
    for (let i = 0; i < 10; i++) {
        sequence.push(Math.floor(Math.random() * 4) + 1);
    }
}

// Función que reproduce la secuencia de colores
function playSequence() {
    let i = 0;

    const intervalId = setInterval(() => {
        lightUp(sequence[i]);
        i++;

        if (i >= 1) {
            clearInterval(intervalId);
            enableUserInput();
        }
    }, speed);
}

// Función que ilumina un color específico
function lightUp(color) {
    const colorElement = document.getElementById(`color${color}`);


    colorElement.style.opacity = '0.7';

    playColorSound(color);

    setTimeout(() => {
        colorElement.style.opacity = '1';
    }, speed / 2);
}

// Función que reproduce el sonido de un color
function playColorSound(color) {
    const audioPath = `sounds/${color}.mp3`; // Ajusta la ruta a tus archivos de sonido
    const audioElement = new Audio(audioPath);
    audioElement.play();
}

// Función que habilita la entrada del usuario
function enableUserInput() {
    gameBoard.addEventListener('click', handleUserClick);
}

// Función que maneja el clic del usuario

function handleUserClick(event) {
    const clickedColor = event.target.dataset.color;
    if (clickedColor) {
        lightUp(clickedColor);
        userSequence.push(parseInt(clickedColor));
        checkUserInput();
    }
}

// Función que verifica la entrada del usuario
function checkUserInput() {
    if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
        endGame();
    } else if (userSequence.length === sequence.length) {
        userSequence = [];
        score++;
        setTimeout(() => {
            generateNextColor();
            playUserSequence();
        }, 2000);
    }
}

// Función que reproduce la secuencia del usuario
function playUserSequence() {
    let i = 0;

    const intervalId = setInterval(() => {
        lightUp(sequence[i]);
        i++;

        if (i >= sequence.length) {
            clearInterval(intervalId);
            enableUserInput();
        }
    }, speed);
}

// Función que genera el próximo color en la secuencia
function generateNextColor() {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    sequence.push(nextColor);
}


// Función que termina el juego
function endGame() {
    gameStarted = false;
    gameBoard.removeEventListener('click', handleUserClick);

    const playerInitials = prompt('¡Game Over! Ingresa tus iniciales (máximo 3 letras) para guardar la puntuación:');

    const playerName = playerInitials ? playerInitials.slice(0, 3).toUpperCase() : "ASS";

    if (playerName) {
        saveScore(playerName, score);
    }
}

// Función que guarda la puntuación del jugador
function saveScore(playerName, playerScore) {
    const scoresTable = document.getElementById('scores-table');

    const newRow = scoresTable.insertRow(-1);
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);

    cell1.innerHTML = playerName;
    cell2.innerHTML = playerScore;
}

// Función que muestra la tabla de puntuaciones
function showScores() {
    scoresModal.style.display = 'block';
}

// Función que cierra el modal de puntuaciones
function closeScoresModal() {
    scoresModal.style.display = 'none';
}

// Función que actualiza la velocidad del juego
function updateSpeed() {
    speed = parseInt(speedInput.value) * 100;
}

initializeGameBoard();
