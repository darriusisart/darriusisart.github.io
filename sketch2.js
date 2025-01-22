new p5((p) => {
    p.setup = function () {
      p.createCanvas(400, 400);
    };
  
    p.draw = function () {
      p.noStroke();
      p.background(255);
      p.fill(255, 0, 0, 50);
      p.circle(100, 100, 90);
      p.fill(0, 255, 0, 50);
      p.circle(125, 120, 90);
      p.fill(0, 0, 255, 50);
      p.circle(75, 125, 90);
    };
  }, 'sketch2');
  