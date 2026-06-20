const puzzle = document.getElementById("puzzle");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");
const levelEl = document.getElementById("level");
const clickSound = document.getElementById("clickSound");

let tiles = [];
let size = 4;

let moves = 0;
let time = 0;
let timer;
let running = false;

let best = localStorage.getItem("bestMoves") || 0;
bestEl.textContent = best;

function init(){
    size = parseInt(levelEl.value);

    puzzle.style.gridTemplateColumns = `repeat(${size},1fr)`;

    tiles = [...Array(size*size-1).keys()].map(i=>i+1);
    tiles.push("");

    moves = 0;
    time = 0;
    running = false;

    movesEl.textContent = 0;
    timerEl.textContent = 0;

    clearInterval(timer);

    render();
    shuffle();
}

function render(){
    puzzle.innerHTML = "";

    tiles.forEach((t,i)=>{
        const div = document.createElement("div");

        if(t === ""){
            div.className = "tile empty";
        }else{
            div.className = "tile";
            div.textContent = t;

            div.onclick = ()=>{
                clickSound.play();
                move(i);
            };
        }

        puzzle.appendChild(div);
    });
}

function move(i){
    const empty = tiles.indexOf("");

    const valid = [
        empty-1, empty+1,
        empty-size, empty+size
    ];

    if(valid.includes(i)){

        [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];

        moves++;
        movesEl.textContent = moves;

        if(!running){
            startTimer();
            running = true;
        }

        render();
        checkWin();
    }
}

function shuffle(){
    for(let i=0;i<200;i++){
        const empty = tiles.indexOf("");

        const movesArr = [
            empty-1, empty+1,
            empty-size, empty+size
        ].filter(x=>x>=0 && x<size*size);

        const rand = movesArr[Math.floor(Math.random()*movesArr.length)];

        [tiles[rand], tiles[empty]] = [tiles[empty], tiles[rand]];
    }

    moves = 0;
    time = 0;
    running = false;

    movesEl.textContent = 0;
    timerEl.textContent = 0;

    clearInterval(timer);

    render();
}

function startTimer(){
    timer = setInterval(()=>{
        time++;
        timerEl.textContent = time;
    },1000);
}

function checkWin(){

    for(let i=0;i<tiles.length-1;i++){
        if(tiles[i] !== i+1) return;
    }

    clearInterval(timer);

    if(best == 0 || moves < best){
        localStorage.setItem("bestMoves", moves);
        bestEl.textContent = moves;
    }

    setTimeout(()=>{
        alert(`🎉 YOU WIN!\nMoves: ${moves}\nTime: ${time}s`);
    },200);
}

document.getElementById("shuffleBtn").onclick = shuffle;
document.getElementById("restartBtn").onclick = init;
levelEl.onchange = init;

init();