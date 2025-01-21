function setup()
{
    createCanvas(400, 400);
}
  
function draw() 
{
    noStroke();
    background(0);
    fill(255, 255, 0);
    arc(100, 100, 200, 200, 450, 750); //x,y w,h start,stop
    fill(255, 0, 0);
    rect(225, 80, 150, 115);
    circle(300, 75, 150);
    fill(255);
    circle(340, 75, 45);
    circle(265, 75, 45);
    fill(0, 0, 255);
    circle(340, 75, 30);
    circle(265, 75, 30);
}