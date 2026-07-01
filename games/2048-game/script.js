const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const restartBtn = document.getElementById("restart");

let grid = [];
let score = 0;
let best = localStorage.getItem("best2048") || 0;

bestEl.textContent = best;

function newGame() {
    grid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    score = 0;
    scoreEl.textContent = score;

    addRandomTile();
    addRandomTile();

    drawBoard();
}

function addRandomTile(){

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

    grid[cell.r][cell.c] = Math.random()<0.9 ? 2 : 4;
}

function drawBoard(){

    board.innerHTML="";
    console.log(grid);

    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            const tile=document.createElement("div");

            tile.className="tile";

            let value=grid[r][c];

            tile.textContent=value===0 ? "" : value;

            switch(value){

                case 2:
                    tile.style.background="#EEE4DA";
                    tile.style.color="#333";
                    break;

                case 4:
                    tile.style.background="#EDE0C8";
                    tile.style.color="#333";
                    break;

                case 8:
                    tile.style.background="#F2B179";
                    break;

                case 16:
                    tile.style.background="#F59563";
                    break;

                case 32:
                    tile.style.background="#F67C5F";
                    break;

                case 64:
                    tile.style.background="#F65E3B";
                    break;

                case 128:
                    tile.style.background="#EDCF72";
                    break;

                case 256:
                    tile.style.background="#EDCC61";
                    break;

                case 512:
                    tile.style.background="#EDC850";
                    break;

                case 1024:
                    tile.style.background="#EDC53F";
                    break;

                case 2048:
                    tile.style.background="#EDC22E";
                    break;

                default:
                    tile.style.background="#3F4A5A";

            }

            board.appendChild(tile);

        }

    }

}

restartBtn.onclick = newGame;

newGame();
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

    for (let r = 0; r < 4; r++) {
        grid[r] = slide(grid[r]);
    }

}

function moveRight() {

    for (let r = 0; r < 4; r++) {

        grid[r].reverse();

        grid[r] = slide(grid[r]);

        grid[r].reverse();

    }

}

function moveUp() {

    for (let c = 0; c < 4; c++) {

        let col = [];

        for (let r = 0; r < 4; r++) {
            col.push(grid[r][c]);
        }

        col = slide(col);

        for (let r = 0; r < 4; r++) {
            grid[r][c] = col[r];
        }

    }

}

function moveDown() {

    for (let c = 0; c < 4; c++) {

        let col = [];

        for (let r = 0; r < 4; r++) {
            col.push(grid[r][c]);
        }

        col.reverse();

        col = slide(col);

        col.reverse();

        for (let r = 0; r < 4; r++) {
            grid[r][c] = col[r];
        }

    }

}

document.addEventListener("keydown", function(e){

    let old = JSON.stringify(grid);

    if(e.key==="ArrowLeft") moveLeft();

    if(e.key==="ArrowRight") moveRight();

    if(e.key==="ArrowUp") moveUp();

    if(e.key==="ArrowDown") moveDown();

    if(old!==JSON.stringify(grid)){

        addRandomTile();

        drawBoard();

        scoreEl.textContent = score;

        if(score > best){

            best = score;

            bestEl.textContent = best;

            localStorage.setItem("best2048", best);

        }

    }

});
// -------- Mobile Swipe Controls --------

let startX = 0;
let startY = 0;

board.addEventListener("touchstart", function(e){

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

});

board.addEventListener("touchend", function(e){

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    let old = JSON.stringify(grid);

    if(Math.abs(dx) > Math.abs(dy)){

        if(dx > 30){
            moveRight();
        }

        if(dx < -30){
            moveLeft();
        }

    }else{

        if(dy > 30){
            moveDown();
        }

        if(dy < -30){
            moveUp();
        }

    }

    if(old !== JSON.stringify(grid)){

        addRandomTile();

        drawBoard();

        scoreEl.textContent = score;

        if(score > best){

            best = score;

            bestEl.textContent = best;

            localStorage.setItem("best2048", best);

        }

        checkWin();
        checkGameOver();

    }

});

// -------- Win --------

function checkWin(){

    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            if(grid[r][c]===2048){

                setTimeout(function(){

                    alert("🎉 Congratulations! You reached 2048!");

                },100);

                return;

            }

        }

    }

}

// -------- Game Over --------

function checkGameOver(){

    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            if(grid[r][c]===0){
                return;
            }

        }

    }

    for(let r=0;r<4;r++){

        for(let c=0;c<3;c++){

            if(grid[r][c]===grid[r][c+1]){
                return;
            }

        }

    }

    for(let c=0;c<4;c++){

        for(let r=0;r<3;r++){

            if(grid[r][c]===grid[r+1][c]){
                return;
            }

        }

    }

    setTimeout(function(){

        alert("💀 Game Over!");

    },100);

}
