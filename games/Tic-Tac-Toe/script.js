const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winPatterns = [
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click",handleClick);
});

function handleClick(e){

    const cell = e.target;

    if(cell.textContent!=="" || !gameActive) return;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if(checkWin()){

        statusText.textContent = `🏆 Player ${currentPlayer} Wins!`;

        if(currentPlayer==="X"){
            xScore++;
            document.getElementById("xScore").textContent=xScore;
        }else{
            oScore++;
            document.getElementById("oScore").textContent=oScore;
        }

        gameActive=false;
        return;
    }

    if(checkDraw()){
        statusText.textContent="🤝 Draw!";
        gameActive=false;
        return;
    }

    currentPlayer=currentPlayer==="X"?"O":"X";
    statusText.textContent=`Player ${currentPlayer} Turn`;
}

function checkWin(){
    return winPatterns.some(pattern=>{
        return pattern.every(index=>
            cells[index].textContent===currentPlayer
        );
    });
}

function checkDraw(){
    return [...cells].every(cell=>cell.textContent!=="");
}

restartBtn.addEventListener("click",()=>{
    cells.forEach(cell=>{
        cell.textContent="";
        cell.className="cell";
    });

    currentPlayer="X";
    gameActive=true;
    statusText.textContent="Player X Turn";
});