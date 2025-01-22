new p5((p) => {
    p.setup = function () {
      p.createCanvas(500, 500);
    };
  
    p.draw = function () {
      p.background(0, 0, 255);
      p.stroke(255);
      p.strokeWeight(4);
      p.fill(21, 125, 52);
      p.circle(250, 250, 200);
      p.strokeWeight(3);
      p.fill(255, 0, 0);
      p.beginShape();
      p.vertex(250, 150);
      p.vertex(275, 200);
      p.vertex(340, 200);
      p.vertex(300, 250);
      p.vertex(320, 320);
      p.vertex(250, 275);
      p.vertex(180, 320);
      p.vertex(200, 250);
      p.vertex(160, 200);
      p.vertex(225, 200);
      p.vertex(250, 150);
      p.endShape();
    };
  }, 'sketch4');
  