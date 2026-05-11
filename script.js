const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");

let score1 = 0;
let score2 = 0;

let bullets = [];
let enemies = [];
let particles = [];

const keys = {};

const p1 = {
  x: canvas.width/2 - 120,
  y: canvas.height - 100,
  w: 40,
  h: 40,
  color:"cyan",
  speed:7
};

const p2 = {
  x: canvas.width/2 + 80,
  y: canvas.height - 100,
  w: 40,
  h: 40,
  color:"magenta",
  speed:7
};

document.addEventListener("keydown",e=>{
  keys[e.key]=true;

  if(e.key===" "){
    shoot(p1,"cyan",1);
  }

  if(e.key==="Enter"){
    shoot(p2,"magenta",2);
  }
});

document.addEventListener("keyup",e=>{
  keys[e.key]=false;
});

function shoot(player,color,owner){
  bullets.push({
    x:player.x + player.w/2 - 3,
    y:player.y,
    w:6,
    h:20,
    color,
    speed:10,
    owner
  });
}

function spawnEnemy(){
  enemies.push({
    x:Math.random()*(canvas.width-50),
    y:-50,
    w:50,
    h:50,
    speed:2+Math.random()*3,
    dx:Math.random()*4-2
  });
}

setInterval(spawnEnemy,1000);

function drawShip(player){
  ctx.save();

  ctx.shadowBlur = 20;
  ctx.shadowColor = player.color;

  ctx.fillStyle = player.color;

  ctx.beginPath();
  ctx.moveTo(player.x + player.w/2, player.y);
  ctx.lineTo(player.x, player.y + player.h);
  ctx.lineTo(player.x + player.w, player.y + player.h);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function movePlayers(){

  if(keys["ArrowLeft"] && p1.x>0)
    p1.x-=p1.speed;

  if(keys["ArrowRight"] && p1.x<canvas.width-p1.w)
    p1.x+=p1.speed;

  if(keys["a"] && p2.x>0)
    p2.x-=p2.speed;

  if(keys["d"] && p2.x<canvas.width-p2.w)
    p2.x+=p2.speed;
}

function drawBullets(){

  bullets.forEach((b,i)=>{

    b.y -= b.speed;

    ctx.fillStyle = b.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = b.color;

    ctx.fillRect(b.x,b.y,b.w,b.h);

    if(b.y<0)
      bullets.splice(i,1);
  });
}

function explosion(x,y,color){

  for(let i=0;i<20;i++){

    particles.push({
      x,
      y,
      r:Math.random()*4,
      dx:(Math.random()-0.5)*6,
      dy:(Math.random()-0.5)*6,
      life:40,
      color
    });
  }
}

function drawParticles(){

  particles.forEach((p,i)=>{

    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    if(p.life<=0)
      particles.splice(i,1);
  });
}

function drawEnemies(){

  enemies.forEach((e,ei)=>{

    e.y += e.speed;
    e.x += e.dx;

    if(e.x<=0 || e.x>=canvas.width-e.w)
      e.dx *= -1;

    ctx.fillStyle="red";
    ctx.shadowBlur=20;
    ctx.shadowColor="red";

    ctx.fillRect(e.x,e.y,e.w,e.h);

    bullets.forEach((b,bi)=>{

      if(
        b.x < e.x+e.w &&
        b.x+b.w > e.x &&
        b.y < e.y+e.h &&
        b.y+b.h > e.y
      ){

        explosion(e.x+25,e.y+25,b.color);

        enemies.splice(ei,1);
        bullets.splice(bi,1);

        if(b.owner===1){
          score1++;
          score1El.textContent=score1;
        }

        if(b.owner===2){
          score2++;
          score2El.textContent=score2;
        }
      }
    });

  });
}

function stars(){

  for(let i=0;i<80;i++){

    ctx.fillStyle="white";

    ctx.fillRect(
      Math.random()*canvas.width,
      Math.random()*canvas.height,
      2,
      2
    );
  }
}

function animate(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  stars();

  movePlayers();

  drawShip(p1);
  drawShip(p2);

  drawBullets();

  drawEnemies();

  drawParticles();

  requestAnimationFrame(animate);
}

animate();

document.getElementById("left").addEventListener("touchstart",()=>{
  p1.x -= 40;
});

document.getElementById("right").addEventListener("touchstart",()=>{
  p1.x += 40;
});

document.getElementById("shoot").addEventListener("touchstart",()=>{
  shoot(p1,"cyan",1);
});