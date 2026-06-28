const board = document.getElementById("board");
const scoreElement = document.getElementById("score");

let grid = [];
let score = 0;

function restartGame() {
    score = 0;
    scoreElement.textContent = score;

    grid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    addNumber();
    addNumber();
    drawBoard();
}

function addNumber() {
    let empty = [];

    for(let r=0;r<4;r++){
        for(let c=0;c<4;c++){
            if(grid[r][c]===0){
                empty.push({r,c});
            }
        }
    }

    if(empty.length===0) return;

    let cell = empty[Math.floor(Math.random()*empty.length)];

    grid[cell.r][cell.c] =
        Math.random()<0.9 ? 2 : 4;
}

function drawBoard() {

    board.innerHTML="";

    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            const tile=document.createElement("div");

            tile.className="tile";

            let value=grid[r][c];

            tile.textContent=value===0 ? "" : value;

            tile.style.background=getColor(value);

            tile.style.color=value<=4 ? "#776e65":"white";

            board.appendChild(tile);

        }

    }

}

function getColor(value){

    switch(value){

        case 0:return "#cdc1b4";
        case 2:return "#eee4da";
        case 4:return "#ede0c8";
        case 8:return "#f2b179";
        case 16:return "#f59563";
        case 32:return "#f67c5f";
        case 64:return "#f65e3b";
        case 128:return "#edcf72";
        case 256:return "#edcc61";
        case 512:return "#edc850";
        case 1024:return "#edc53f";
        case 2048:return "#edc22e";
        default:return "#3c3a32";

    }

}
function slide(row) {
    row = row.filter(val => val);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }

    row = row.filter(val => val);

    while (row.length < 4) {
        row.push(0);
    }

    return row;
}

function moveLeft() {

    let changed = false;

    for (let r = 0; r < 4; r++) {

        let oldRow = [...grid[r]];

        grid[r] = slide(grid[r]);

        if (oldRow.toString() !== grid[r].toString()) {
            changed = true;
        }

    }

    if (changed) {
        addNumber();
        scoreElement.textContent = score;
        drawBoard();
      checkGameState();
    }

}

function moveRight() {

    let changed = false;

    for (let r = 0; r < 4; r++) {

        let oldRow = [...grid[r]];

        let reversed = [...grid[r]].reverse();

        reversed = slide(reversed);

        grid[r] = reversed.reverse();

        if (oldRow.toString() !== grid[r].toString()) {
            changed = true;
        }

    }

    if (changed) {
        addNumber();
        scoreElement.textContent = score;
        drawBoard();
    }

}
function moveUp() {

    let changed = false;

    for (let c = 0; c < 4; c++) {

        let column = [];

        for (let r = 0; r < 4; r++) {
            column.push(grid[r][c]);
        }

        let oldColumn = [...column];

        column = slide(column);

        for (let r = 0; r < 4; r++) {
            grid[r][c] = column[r];
        }

        if (oldColumn.toString() !== column.toString()) {
            changed = true;
        }
    }

    if (changed) {
        addNumber();
        scoreElement.textContent = score;
        drawBoard();
    }
}

function moveDown() {

    let changed = false;

    for (let c = 0; c < 4; c++) {

        let column = [];

        for (let r = 0; r < 4; r++) {
            column.push(grid[r][c]);
        }

        let oldColumn = [...column];

        column.reverse();
        column = slide(column);
        column.reverse();

        for (let r = 0; r < 4; r++) {
            grid[r][c] = column[r];
        }

        if (oldColumn.toString() !== grid[r].map(row => row[c]).toString()) {
            changed = true;
        }
    }

    if (changed) {
        addNumber();
        scoreElement.textContent = score;
        drawBoard();
    }
}

document.addEventListener("keydown", function(e) {

    switch (e.key) {

        case "ArrowLeft":
            moveLeft();
            break;

        case "ArrowRight":
            moveRight();
            break;

        case "ArrowUp":
            moveUp();
            break;

        case "ArrowDown":
            moveDown();
            break;
    }

});

restartGame();
function hasWon() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 2048) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {

    // Empty cell available?
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
        }
    }

    // Horizontal check
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            if (grid[r][c] === grid[r][c + 1]) return false;
        }
    }

    // Vertical check
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 3; r++) {
            if (grid[r][c] === grid[r + 1][c]) return false;
        }
    }

    return true;
}

function checkGameState() {

    if (hasWon()) {
        setTimeout(() => {
            alert("🎉 Congratulations! You reached 2048!");
        }, 100);
    }

    if (isGameOver()) {
        setTimeout(() => {
            alert("💀 Game Over!");
        }, 100);
    }
}

// Touch support (Mobile)
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", function (e) {

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) moveRight();
        else if (dx < -30) moveLeft();
    } else {
        if (dy > 30) moveDown();
        else if (dy < -30) moveUp();
    }

    checkGameState();

});
