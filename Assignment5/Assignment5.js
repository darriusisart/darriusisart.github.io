let startContext, samples, button1, button2, button3, button4;
let delayTimeSlider, feedbackSlider, wetSlider, distortionAmountSlider;
let contextStarted = false;

let revb = new Tone.Reverb(0.5).toDestination();
let distort = new Tone.Distortion(0).connect(revb);
let delay = new Tone.FeedbackDelay(0.5, 0.5).connect(distort);
delay.wet.value = 0.5;

function setup() {
  createCanvas(400, 400).position((windowWidth - width) / 2, 100); // Center canvas

  let centerX = (windowWidth - 400) / 2; // Calculate center for UI elements

  startContext = createButton("Start Audio Context");
  startContext.position(centerX + 140, 120);
  startContext.mousePressed(startAudioContext);

  button1 = createButton("Sample1");
  button1.position(centerX + 10, 160);
  button1.mousePressed(() => playSound("sample1"));
  button1.attribute("disabled", true);

  button2 = createButton("Sample2");
  button2.position(centerX + 110, 160);
  button2.mousePressed(() => playSound("sample2"));
  button2.attribute("disabled", true);

  button3 = createButton("Sample3");
  button3.position(centerX + 210, 160);
  button3.mousePressed(() => playSound("sample3"));
  button3.attribute("disabled", true);

  button4 = createButton("Sample4");
  button4.position(centerX + 310, 160);
  button4.mousePressed(() => playSound("sample4"));
  button4.attribute("disabled", true);

  delayTimeSlider = createSlider(0, 1, 0.5, 0.01);
  delayTimeSlider.position(centerX + 20, 250);
  delayTimeSlider.input(() => delay.delayTime.value = delayTimeSlider.value());

  feedbackSlider = createSlider(0, 0.99, 0.5, 0.01);
  feedbackSlider.position(centerX + 240, 250);
  feedbackSlider.input(() => delay.feedback.value = feedbackSlider.value());

  distortionAmountSlider = createSlider(0, 10, 0, 0.01);
  distortionAmountSlider.position(centerX + 135, 320);
  distortionAmountSlider.input(() => distort.distortion = distortionAmountSlider.value());

  wetSlider = createSlider(0, 1, 0.5, 0.01);
  wetSlider.position(centerX + 135, 390);
  wetSlider.input(() => revb.wet.value = wetSlider.value());
}

function draw() {
  background(220);
  textSize(16);
  textAlign(CENTER);
  fill(0);
  
  text("Delay Time: " + delayTimeSlider.value(), width / 2 - 20, 140);
  text("Feedback: " + feedbackSlider.value(), width / 2 + 90, 140);
  text("Distortion: " + distortionAmountSlider.value(), width / 2 - 10, 210);
  text("Reverb Wetness: " + wetSlider.value(), width / 2 - 10, 280);
}

function startAudioContext() {
  if (!contextStarted) {
    Tone.start(); // Ensure the context starts inside the user interaction
    contextStarted = true;
    
    // Now load the samples AFTER the context has started
    samples = new Tone.Players({
      sample1: "samples/sample1.wav",
      sample2: "samples/sample2.wav",
      sample3: "samples/sample3.wav",
      sample4: "samples/sample4.wav"
    }).connect(delay); // Connected to delay instead of toDestination()

    enableButtons();
    console.log("Audio Context Started");
  }
}

function enableButtons() {
  button1.removeAttribute("disabled");
  button2.removeAttribute("disabled");
  button3.removeAttribute("disabled");
  button4.removeAttribute("disabled");
}

function playSound(sampleName) {
  if (contextStarted) {
    samples.player(sampleName).start();
  } else {
    console.log("Audio context is not started yet.");
  }
}
