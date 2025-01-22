new p5((p) => {
  p.setup = function () {
    p.createCanvas(400, 400);
  };

  p.draw = function () {
    p.background(0, 255, 0);
    p.square(225, 25, 150); // location x, y, size
    p.circle(100, 100, 150);
  };
}, 'sketch1');
