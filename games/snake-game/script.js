let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

let box = 20;

let snake, direction, food, score, level, speed, game;
let high = localStorage.getItem("high") || 0;

document.getElementById("high").innerText = high;

let eatSound = document.getElementById("eatSound");
let bgMusic = document.getElementById("bgMusic");

// 📱 SWIPE CONTROL
let startX, startY;

canvas.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e=>{
    let dx = e.changedTouches[0].clientX - startX;
    let dy = e.changedTouches[0].clientY - startY;

    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0) direction = "RIGHT";
        else direction = "LEFT";
    } else {
        if(dy > 0) direction = "DOWN";
        else direction = "UP";
    }
});

// keyboard
document.addEventListener("keydown",e=>{
    if(e.key=="ArrowUp") direction="UP";
    if(e.key=="ArrowDown") direction="DOWN";
    if(e.key=="ArrowLeft") direction="LEFT";
    if(e.key=="ArrowRight") direction="RIGHT";
});

function startGame(){

    document.getElementById("menu").style.display="none";

    snake=[{x:200,y:200}];
    direction="RIGHT";

    food=randomFood();

    score=0;
    level=1;
    speed=200;

    document.getElementById("score").innerText=0;
    document.getElementById("level").innerText=1;

    clearInterval(game);
    game=setInterval(draw,speed);

    bgMusic.play(); // 🎵 MUSIC START
}

function randomFood(){
    return {
        x: Math.floor(Math.random()*20)*box,
        y: Math.floor(Math.random()*20)*box
    };
}

function draw(){

    ctx.fillStyle="#222";
    ctx.fillRect(0,0,400,400);

    snake.forEach((s,i)=>{
        ctx.fillStyle=i==0?"#00ff88":"white";
        ctx.fillRect(s.x,s.y,box,box);
    });

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,box,box);

    let head={...snake[0]};

    if(direction=="UP") head.y-=box;
    if(direction=="DOWN") head.y+=box;
    if(direction=="LEFT") head.x-=box;
    if(direction=="RIGHT") head.x+=box;

    // eat
    if(head.x==food.x && head.y==food.y){

        score++;
        eatSound.play();

        // 📳 vibration
        if(navigator.vibrate){
            navigator.vibrate(100);
        }

        food=randomFood();

        document.getElementById("score").innerText=score;

        if(score % 5 == 0){
            level++;
            document.getElementById("level").innerText=level;

            speed -= 20;
            if(speed < 60) speed = 60;

            clearInterval(game);
            game=setInterval(draw,speed);
        }

    } else {
        snake.pop();
    }

    // collision
    if(
        head.x<0 || head.x>=400 ||
        head.y<0 || head.y>=400 ||
        collision(head,snake)
    ){
        gameOver();
        return;
    }

    snake.unshift(head);
}

function collision(head,array){
    return array.some(s=>s.x==head.x && s.y==head.y);
}

function gameOver(){

    clearInterval(game);
    bgMusic.pause();

    if(score > high){
        high = score;
        localStorage.setItem("high",high);
    }

    document.getElementById("high").innerText=high;

    alert("💀 Game Over!");
}

function restart(){
    location.reload();
}