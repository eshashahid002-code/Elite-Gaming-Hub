let playerScore = 0;
let aiScore = 0;
let streak = 0;

const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const resultEl = document.getElementById("result");
const streakEl = document.getElementById("streak");

const music = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const musicBtn = document.getElementById("musicBtn");

let musicOn = false;

// GOD MODE AI (slightly smart)
function getAIChoice(playerChoice){

    const counter = {
        rock: "paper",
        paper: "scissors",
        scissors: "rock"
    };

    // 60% chance AI counters you
    if(Math.random() < 0.6){
        return counter[playerChoice];
    }

    const choices = ["rock","paper","scissors"];
    return choices[Math.floor(Math.random()*3)];
}

function play(playerChoice){

    const aiChoice = getAIChoice(playerChoice);

    let result = "";

    if(playerChoice === aiChoice){
        result = "🤝 Draw!";
    }
    else if(
        (playerChoice==="rock" && aiChoice==="scissors") ||
        (playerChoice==="paper" && aiChoice==="rock") ||
        (playerChoice==="scissors" && aiChoice==="paper")
    ){
        result = "🔥 You Win!";
        playerScore++;
        streak++;
        winSound.play();
    }
    else{
        result = "💀 AI Wins!";
        aiScore++;
        streak = 0;
        loseSound.play();
    }

    playerScoreEl.textContent = playerScore;
    aiScoreEl.textContent = aiScore;
    streakEl.textContent = streak;

    resultEl.textContent = `You: ${playerChoice} | AI: ${aiChoice} → ${result}`;
}

// MUSIC
musicBtn.onclick = async () => {
    if(!musicOn){
        await music.play();
        musicOn = true;
        musicBtn.textContent = "🔇 Music OFF";
    }else{
        music.pause();
        musicOn = false;
        musicBtn.textContent = "🎵 Music ON";
    }
};

// RESET
document.getElementById("resetBtn").onclick = () => {
    playerScore = 0;
    aiScore = 0;
    streak = 0;

    playerScoreEl.textContent = 0;
    aiScoreEl.textContent = 0;
    streakEl.textContent = 0;

    resultEl.textContent = "Choose your weapon";
};