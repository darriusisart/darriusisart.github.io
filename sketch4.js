function setup() 
{
    createCanvas(500, 500);
}
  
function draw() 
{
    background(0, 0, 255);
    stroke(255);
    strokeWeight(4);
    fill(21,125,52);
    circle(250, 250, 200);
    strokeWeight(3);
    fill(255, 0, 0);
    beginShape();
    vertex(250, 150);
    vertex(275, 200);
    vertex(340, 200);
    vertex(300, 250);
    vertex(320, 320);
    vertex(250, 275);
    vertex(180, 320);
    vertex(200, 250);
    vertex(160, 200);
    vertex(225, 200);
    vertex(250, 150);
    endShape();
}