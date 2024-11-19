const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');

const COLS = 10; // colunas
const ROWS = 20; // linhas
const BLOCK_SIZE = 30; // tamanho do bloco

// definir o tamanho do canvas
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// definir as cores dos tetrominós
const colors = [
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];

// formas dos tetrominós
const tetrominos = [
    [1, 1, 1, 1], // Linha
    [[1, 0, 0], [1, 1, 1]], // L invertido
    [[0, 0, 1], [1, 1, 1]], // L
    [[1, 1], [1, 1]], // Quadrado
    [[0, 1, 1], [1, 1, 0]], // S
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]]  // Z
];

// função para criar o tabuleiro
function createBoard() {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = ''; // Espaço vazio
        }
    }
    return board;
}

let board = createBoard();
let currentPiece = createPiece();
let score = 0;
let linesCleared = 0;

// função para criar um tetrominó aleatório
function createPiece() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length); // Corrigido 'leght' para 'length'
    return {
        shape: tetrominos[randomIndex],
        color: colors[randomIndex],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
    };
}

// desenha o tabuleiro
function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== '') {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white'; // Corrigido 'strokeSyle' para 'strokeStyle'
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// desenha a peça atual
function drawPiece(piece) {
    ctx.fillStyle = piece.color;
    for (let row = 0; row < piece.shape.length; row++) { // Corrigido 'leght' para 'length'
        for (let col = 0; col < piece.shape[row].length; col++) { // Corrigido 'legth' para 'length'
            if (piece.shape[row][col] === 1) {
                ctx.fillRect((piece.x + col) * BLOCK_SIZE, (piece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white'; // Corrigido 'strokeSyle' para 'strokeStyle'
                ctx.strokeRect((piece.x + col) * BLOCK_SIZE, (piece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// verifica se o movimento é válido
function isValidMove(piece, offsetX, offsetY) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) { // Corrigido 'leght' para 'length'
            if (piece.shape[row][col] === 1) {
                const newX = piece.x + col + offsetX;
                const newY = piece.y + row + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== '')) {
                    return false;
                }
            }
        }
    }
    return true;
}

// move a peça para baixo
function movePieceDown() {
    if (isValidMove(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        placePiece();
    }
}

// coloca a peça no tabuleiro
function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col] === 1) {
                board[currentPiece.y + row][currentPiece.x + col] = currentPiece.color;
            }
        }
    }

    clearLines();
    currentPiece = createPiece();
    if (!isValidMove(currentPiece, 0, 0)) {
        gameOver();
    }
}

// remove linhas completas
function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== '')) {
            board.splice(row, 1);
            board.unshift(new Array(COLS).fill(''));
            linesCleared++;
            score += 100;
        }
    }
}

// desenha o jogo
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece);
}

// atualiza o jogo
function update() {
    movePieceDown();
    drawGame();

    document.getElementById('score').innerText = score;
    document.getElementById('lines').innerText = linesCleared;
}

// controles do teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && isValidMove(currentPiece, -1, 0)) {
        currentPiece.x--;
    } else if (e.key === 'ArrowRight' && isValidMove(currentPiece, 1, 0)) {
        currentPiece.x++;
    } else if (e.key === 'ArrowDown') {
        movePieceDown();
    } else if (e.key === 'ArrowUp') {
        const rotated = rotatePiece(currentPiece);
        if (isValidMove(rotated, 0, 0)) {
            currentPiece = rotated;
        }
    }
});

// rotaciona a peça
function rotatePiece(piece) {
    const rotatedShape = piece.shape[0].map((_, index) =>
        piece.shape.map(row => row[index])
    ).reverse();

    return {
        ...piece, shape: rotatedShape
    };
}

// termina o jogo
function gameOver() {
    alert('Game Over');
    board = createBoard();
    score = 0;
    linesCleared = 0;
}

// inicia o jogo
setInterval(update, 500);