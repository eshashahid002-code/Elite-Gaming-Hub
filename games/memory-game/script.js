let level=1, score=0, lives=3, time=60;
let coins = localStorage.getItem("coins") || 0;
let best = localStorage.getItem("best") || 0;

document.getElementById("coins").innerText = coins;
document.getElementById("best").innerText = best;

let game=document.querySelector(".game");
let msg=document.getElementById("msg");

let first=null, second=null;
let timer;

function emojis(level){
    if(level==1) return ["🎮","🎮","🐍","🐍"];
    if(level==2) return ["🎮","🎮","🐍","🐍","🚗","🚗"];
    return ["🎮","🎮","🐍","🐍","🚗","🚗","🔥","🔥"];
}

function startGame(lv){

    level=lv;
    document.getElementById("menu").style.display="none";

    score=0;
    lives=3;
    time=60;

    update();

    game.innerHTML="";
    msg.innerHTML="";

    clearInterval(timer);
    timer=setInterval(()=>{
        time--;
        update();
        if(time==0) gameOver();
    },1000);

    let arr=emojis(level).sort(()=>Math.random()-0.5);

    let cols = level==1?2:level==2?3:4;
    game.style.gridTemplateColumns=`repeat(${cols},80px)`;

    arr.forEach(e=>{
        let box=document.createElement("div");
        box.classList.add("card");
        box.innerText="❓";

        box.onclick=function(){

            if(box.classList.contains("flip")) return;

            box.classList.add("flip");
            box.innerText=e;

            if(!first){
                first=box;
            }else{
                second=box;

                if(first.innerText===second.innerText){
                    score++;
                    coins++;
                    save();
                    checkWin();
                }else{
                    setTimeout(()=>{
                        first.classList.remove("flip");
                        second.classList.remove("flip");
                        first.innerText="❓";
                        second.innerText="❓";

                        lives--;
                        update();

                        if(lives==0) gameOver();

                    },500);
                }

                first=null;
                second=null;
            }
        }

        game.appendChild(box);
    });
}

function update(){
    document.getElementById("level").innerText=level;
    document.getElementById("score").innerText=score;
    document.getElementById("lives").innerText=lives;
    document.getElementById("time").innerText=time;
    document.getElementById("coins").innerText=coins;
}

function save(){
    if(score>best){
        best=score;
        localStorage.setItem("best",best);
    }
    localStorage.setItem("coins",coins);
}

function checkWin(){
    let cards=document.querySelectorAll(".card");
    let win=true;

    cards.forEach(c=>{
        if(!c.classList.contains("flip")) win=false;
    });

    if(win){
        msg.innerHTML="🎉 Level Complete!";
        clearInterval(timer);
    }
}

function gameOver(){
    clearInterval(timer);
    msg.innerHTML="💀 Game Over!";
    document.getElementById("menu").style.display="block";
}

function restart(){
    document.getElementById("menu").style.display="block";
    game.innerHTML="";
    msg.innerHTML="";
    clearInterval(timer);
}