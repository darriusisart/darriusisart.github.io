let img, brokenImg;
let noise, osc, tapOsc;
let env, filter;
let clickCount = 0;

function preload() {
  img = loadImage('images/glass.jpeg'); 
  brokenImg = loadImage('images/brokenglass.jpeg');
}

function setup() {
  createCanvas(600, 400);
  background(220);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Click to Break the Glass!", width / 2, height / 2);

  // White noise for the shattering effect
  noise = new p5.Noise();
  noise.setType('white');
  noise.amp(0);
  
  // Sine wave for shattering resonance
  osc = new p5.Oscillator('sine');
  osc.freq(100);
  osc.amp(0);

  // Short tap sound for pressing on the glass
  tapOsc = new p5.Oscillator('triangle');
  tapOsc.freq(140);
  tapOsc.amp(0);

  // Envelope for amplitude shaping
  env = new p5.Envelope();
  env.setADSR(0.01, 0.1, 0.1, 0.3);
  env.setRange(0.5, 0);

  // Low-pass filter to change frequency response over time
  filter = new p5.Filter('lowpass');
  filter.freq(1000);
  filter.res(5);

  noise.disconnect();
  noise.connect(filter);
  osc.disconnect();
  osc.connect(filter);
  tapOsc.disconnect();
  tapOsc.connect(filter);
  filter.connect();
}

function mousePressed() {
  clickCount++;
  if (clickCount >= 10) {
    background(brokenImg);
  } else {
    background(img); 
    tapOsc.start();
    tapOsc.amp(0.3, 0.05);
    tapOsc.amp(0, 0.1);
  }
  
  if (clickCount === 10) {
    noise.start();
    noise.amp(0.5, 0.02);
    noise.amp(0, 0.2);
    osc.start();
    env.play(osc);
    filter.freq(5000, 0.2);
    filter.freq(500, 0.5);
  }
}