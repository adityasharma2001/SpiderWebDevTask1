var canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
var balloons = [];

var maxballRadius = 50;
    var vmax = 4;
    var firstgen = 5;
    var minballradius = 30;
    var genRate = 1;
    var genAcc = 1;

    var Score = 0;
    var AddScore = 0;
    var Highscore = parseInt(localStorage.getItem("highscore"))||0;

    interval = null;
    listener();
    initialise();

    var colors = ["#1797ff","#17f3ff","#ff17c1","#ff7c17","#17ff45","#9e17ff","#c917ff","#ff178f"];

    function initialise(){
      window.addEventListener('resize', resizeCanvas, false);
      resizeCanvas();
    }

    function canvasdraw(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for(i=0; i<balloons.length; i++){
        ctx.beginPath();
        ctx.arc(balloons[i].x, balloons[i].y, balloons[i].radius, 0, Math.PI*2);
        ctx.fillStyle = balloons[i].color;
        ctx.fill();
        ctx.closePath();

      }
    }

    function draw(){
      canvasdraw();
      for (i = 0; i < balloons.length; i++)
      {
          for (j = i + 1; j < balloons.length; j++)
          {
              if (Math.pow(balloons[i].x + balloons[i].dx - balloons[j].x - balloons[j].dx, 2) + Math.pow(balloons[i].y + balloons[i].dy - balloons[j].y - balloons[j].dy, 2) <= Math.pow(balloons[i].radius + balloons[j].radius,2))
              {

                  speedx = Math.sqrt(Math.pow(balloons[i].dx,2) + Math.pow(balloons[i].dy,2));
                  speedy = Math.sqrt(Math.pow(balloons[j].dx,2) + Math.pow(balloons[j].dy,2));

                  radx = Math.atan(balloons[i].dy/balloons[i].dx);
                  rady = Math.atan(balloons[j].dy/balloons[j].dx);

                  if (balloons[i].dx < 0)
                  {
                      radx += Math.PI;
                  }

                  if (balloons[j].dx < 0)
                  {
                      rady += Math.PI;
                  }


                  rad = Math.atan((balloons[i].y + balloons[i].dy - balloons[j].y - balloons[j].dy)/(balloons[i].x + balloons[i].dx - balloons[j].x - balloons[j].dx));

                  if (balloons[i].x + balloons[i].dx - balloons[j].x - balloons[j].dx > 0)
                  {
                      rad += Math.PI
                  }

                  U = speedx * Math.cos(radx - rad);
                  U1 = speedy * Math.cos(rady - rad);

                  cos = Math.cos(rad);
                  sin = Math.sin(rad);

                  Vt = speedx * Math.sin(radx - rad);
                  Vt1 = speedy * Math.sin(rady - rad);

                  R = Math.pow((balloons[i].radius),3);
                  R1 = Math.pow((balloons[j].radius),3);

                  Vr = ((2 * R1 * U1) + ((R - R1)*U))/(R + R1);
                  Vr1 = ((2 * R * U) + ((R1 - R)*U1))/(R + R1);

                  balloons[i].dx = (Vr * cos) - (Vt * sin);
                  balloons[j].dx = (Vr1 * cos) - (Vt1 * sin);
                  balloons[i].dy = (Vr * sin) + (Vt * cos);
                  balloons[j].dy = (Vr1 * sin) + (Vt1 * cos);
              }
          }

          if(balloons[i].x + balloons[i].dx > canvas.width-balloons[i].radius || balloons[i].x + balloons[i].dx < balloons[i].radius) {
              balloons[i].dx = -balloons[i].dx;
          }
          if(balloons[i].y + balloons[i].dy  > canvas.height-balloons[i].radius || balloons[i].y + balloons[i].dy < balloons[i].radius) {
              balloons[i].dy  = -balloons[i].dy ;
          }

          balloons[i].x += balloons[i].dx;
          balloons[i].y += balloons[i].dy;
      }

    }
    time = 10000;
    AddScoretimer = -1;

    paused = false;

    endtimer = 0;

    gameover = false;
    function check()
    {
        areacovered = 0;
        for (i = 0; i < balloons.length;i++)
        {
            areacovered += Math.pow(balloons[i].radius * 2,2);
        }

        percent =  Math.PI * areacovered / (canvas.width * canvas.height);



        if (percent > 0.75)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    function create(){
      if (AddScoretimer > 0)
      {
          AddScoretimer += 10;

          if (AddScoretimer > 1000)
          {
              Score += AddScore;
              AddScore = 0;
              (document.getElementById("score")).innerHTML = "Score : " + Score;
              AddScoretimer = -1;

          }
      }
      if (!paused )
      {
          time += 10;

          if (time > (10000/genRate) && endtimer < 10000)
          {

              if(10000/genRate > 1000)
                  genRate += genAcc;


              if (!( (canvas.width/(firstgen)) - maxballRadius >= maxballRadius * 2))
              {
                  firstgen = Math.floor(2 * maxballRadius);
              }


              for (i = 0; i < firstgen; i++)
              {
                  vy = (Math.random() * (vmax - 1) * -1) + -1;
                  randx = Math.random();
                  randc = Math.floor(Math.random()*colors.length);
                  if (randx > 0.5)
                  {
                      randx = -1;
                  }
                  else
                  {
                      randx = +1;
                  }

                  randr = (Math.random() *(maxballRadius - minballradius)) + minballradius;
                  randxx = (canvas.width/(firstgen + 1)) * (i + 1);
                  randyy = canvas.height - (maxballRadius*2);
                  console.log(i);
                  if (drawchecker(randxx,randyy,randr))
                      balloons.push(new createballoons(randxx,randyy,randx * Math.sqrt(Math.pow(vmax,2) - Math.pow(vy,2)),vy,randr,colors[randc],1,"NB"));
              }


              time = 0;
          }



    if (check())
            {
                (document.getElementById("time")).innerHTML = "Time Remaining : " + Math.round(10 - (endtimer/1000)) + " s";
                endtimer += 10;

                if(endtimer>10000)
                {
                  gameover = true;
                  pause();
                  if(Highscore<Score+AddScore){
                    localStorage.setItem("highscore",""+(Score+AddScore));
                  }
                  interval.clearInterval();
                }
                else {
                  draw();
                }
              }
              else{
                endtimer=0;
                draw();
              }
            }
          }

        function resizeCanvas() {
        canvas.style.width ='100%';
        canvas.style.height='100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        if (interval != null)
            interval.clearInterval();
        Score += AddScore;
        AddScore = 0;
        for (i = 0; i < balloons.length;i++)
        {
            if (balloons[i].x > canvas.width)
            {
                AddScore -= 10*(maxballRadius/balloons[i].radius);
                AddScore = Math.round(AddScore);
                (document.getElementById("score")).innerHTML = "Score : " + Score + " - " + AddScore;
                balloons.splice(i,1);
                AddScoretimer = 10;
                if (genRate + (genAcc/maxballRadius) > 1)
                {
                    genRate += genAcc/maxballRadius;
                }
            }
            else if (balloons[i].y > canvas.height)
            {
                AddScore -= 10*(maxballRadius/balloons[i].radius);
                AddScore = Math.round(AddScore);
                (document.getElementById("score")).innerHTML = "Score : " + Score + " - " + AddScore;
                balloons.splice(i,1);
                AddScoretimer = 10;
                if (genRate + (genAcc/maxballRadius) > 1)
                {
                    genRate += genAcc/maxballRadius;
                }
            }
        }

        interval = setInterval(create,10);
      }
      function drawchecker(x,y,radius)
    {
        console.log(x);
        bool = true;
        for (j = 0; j < balloons.length; j++)
        {
            if (!(Math.pow(balloons[j].x - x,2) + Math.pow(balloons[j].y - y,2) > Math.pow(radius + balloons[j].radius,2)))
            {
                bool = false;
            }
        }
        console.log(x + " Success");
        return bool;
    }

    function listener ()
    {
        canvas.addEventListener('mousedown', function(e) {
            if (e.button == 0 && !paused)
            {
                const rect = canvas.getBoundingClientRect()
                mousex = event.clientX - rect.left + 18;
                mousey = event.clientY - rect.top + 18;

                for (i = 0; i < balloons.length;i++)
                {
                    if (Math.pow((mousex - balloons[i].x),2) + Math.pow((mousey - balloons[i].y),2) <= Math.pow(balloons[i].radius + 18,2))
                    {
                        if (balloons[i].type == "GT")
                        {

                            if (AddScore != 0)
                            {
                                Score += AddScore;
                            }
                            AddScore = 0;
                            for(i = 0; i < balloons.length/2; i++)
                            {
                                AddScore += 10*(maxballRadius/balloons[i].radius);
                                if (genRate - (genAcc/maxballRadius) > 1)
                                {
                                    genRate -= genAcc/maxballRadius;
                                }
                            }
                            AddScore = Math.round(AddScore);
                            (document.getElementById("score")).innerHTML = "Score : " + Score + " + " + AddScore;
                            balloons.splice(0,i);
                            AddScoretimer = 10;

                            mousex = -1;
                            mousey = -1;
                            checker();
                            break;
                        }
                        if (balloons[i].clicks == 1)
                        {
                            if (AddScore != 0)
                            {
                                Score += AddScore;
                            }
                            AddScore = 10*(maxballRadius/balloons[i].radius);


                            AddScore = Math.round(AddScore);
                            (document.getElementById("score")).innerHTML = "Score : " + Score + " + " + AddScore;
                            balloons.splice(i,1);
                            AddScoretimer = 10;
                            if (genRate - (genAcc/maxballRadius) > 1)
                            {
                                genRate -= genAcc/maxballRadius;
                            }
                            mousex = -1;
                            mousey = -1;
                            break;
                        }
                        else
                        {
                            balloons[i].clicks -= 1;
                        }
                    }
                }
            }
            else if(e.button == 0)
            {
                const rect = canvas.getBoundingClientRect()
                mousex = event.clientX - rect.left;
                mousey = event.clientY - rect.top;

                if (gameover)
                {
                    if (mousex > canvas.width/2 -125 && mousex < canvas.width/2 + 125 && mousey > canvas.height/2 && mousey < canvas.height/2 + 50)
                    {
                        location.reload();
                    }
                }
                else
                {
                    if (mousex > canvas.width/2 -125 && mousex < canvas.width/2 + 125 && mousey > canvas.height/2 && mousey < canvas.height/2 + 50)
                    {
                        pause();
                    }
                }
            }
        });

        canvas.addEventListener('mousemove', function(e) {
            if(paused)
            {
                const rect = canvas.getBoundingClientRect()
                mousex = event.clientX - rect.left;
                mousey = event.clientY - rect.top;

                ctx.beginPath();

                    if (mousex > canvas.width/2 -125 && mousex < canvas.width/2 + 125 && mousey > canvas.height/2 && mousey < canvas.height/2 + 50)
                    {
                        ctx.fillStyle = "#4b00a0";
                    }
                    else
                    {
                        ctx.fillStyle = "#8c00ff";
                    }
                    ctx.rect(canvas.width/2 - 125,canvas.height/2,250,50);
                        ctx.fill();
                        ctx.closePath();

                        ctx.font = "30px Comic Sans MS";
                        ctx.fillStyle = "#FFFFFF";
                        ctx.textAlign = "center";

                if (gameover)
                {
                    ctx.fillText("Restart Game", canvas.width/2, canvas.height/2+ 35);
                }
                else
                {
                    ctx.fillText("Resume Game", canvas.width/2, canvas.height/2+ 35);
                }
            }
        });

        (document.getElementById("pause")).addEventListener('mousedown', function(e) {
            if (e.button == 0 && !gameover)
            {
                pause();
            }
            else if (e.button == 0)
            {
                window.location.href = "index.html";
            }

        });
        window.addEventListener('keydown', function(e){
            if (e.key == "Escape" && !gameover)
            {
                pause();
            }
        },true);
    }

    function createballoons (posx,posy,dx,dy,radius,color,clicks,type)
        {
            this.x = posx;
            this.y = posy;
            this.radius = radius;
            this.dx = dx;
            this.dy = dy;
            this.color = color;
            this.clicks = clicks;
            this.type = type;
        }

        function pause()
  {
      if (paused)
              {
                (document.getElementById("pause")).innerHTML="PAUSE";

                  paused = false;
              }
              else
              {
                  (document.getElementById("pause")).innerHTML="PLAY";

                  if (gameover)
                      (document.getElementById("pause")).innerHTML = "Game Over";
                  ctx = canvas.getContext("2d");
                  oldfilter = ctx.filter;
                  ctx.filter = "blur(10px)";
                  canvasdraw();
                  ctx.filter = oldfilter;
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.rect(canvas.width/4,canvas.height/4,canvas.width/2,canvas.height/2);
                  ctx.fill();
                  ctx.closePath();
                  ctx.filter = "blur(5px)";
                  ctx.lineWidth = "5";
                  ctx.strokeStyle = "#FFFFFF";
                  ctx.strokeRect(canvas.width/4,canvas.height/4,canvas.width/2,canvas.height/2);
                  ctx.filter = oldfilter;


                  ctx.font = "60px Comic Sans MS";
                  ctx.fillStyle = "teal";
                  if (gameover)
                      ctx.fillStyle = "#FF0000";
                  ctx.textAlign = "center";
                  if(gameover)
                      ctx.fillText("Game Over", canvas.width/2, 3 * canvas.height/8);
                  else
                      ctx.fillText("Game Paused", canvas.width/2, 3 * canvas.height/8);
                  ctx.beginPath();
                  ctx.fillStyle = "#8c00ff";
                  ctx.rect(canvas.width/2 - 125,canvas.height/2,250,50);
                  ctx.fill();
                  ctx.closePath();

                  ctx.font = "30px Comic Sans MS";
                  ctx.fillStyle = "#FFFFFF";
                  ctx.textAlign = "center";


                  if (gameover)
                      ctx.fillText("Restart Game", canvas.width/2, canvas.height/2+ 35);
                  else
                      ctx.fillText("Resume Game", canvas.width/2, canvas.height/2 + 35);

                  ctx.font = "30px Comic Sans MS";
                  ctx.fillStyle = "#00FF00";
                  ctx.textAlign = "center";

                  if (Highscore < (Score + AddScore))
                  {
                      ctx.fillText("New High Score : " + (Score + AddScore) , canvas.width/2, 5* canvas.height/8 + 35);
                  }
                  else
                  {
                      ctx.fillText("score : " + (Score + AddScore) + "\n High Score : " + Highscore, canvas.width/2, 5* canvas.height/8 + 35);
                  }



                  paused = true;
              }
  }
