new p5((p) => {
    p.setup = function () {
      p.createCanvas(400, 400);
    };
  
    p.draw = function () {
      p.noStroke();
      p.background(0);
      p.fill(255, 255, 0);
      p.arc(100, 100, 200, 200, 450, 750); // x, y, width, height, start, stop
      p.fill(255, 0, 0);
      p.rect(225, 80, 150, 115);
      p.circle(300, 75, 150);
      p.fill(255);
      p.circle(340, 75, 45);
      p.circle(265, 75, 45);
      p.fill(0, 0, 255);
      p.circle(340, 75, 30);
      p.circle(265, 75, 30);
    };
  }, 'sketch3');
  