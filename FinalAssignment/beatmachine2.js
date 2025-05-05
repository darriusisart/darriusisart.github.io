let port;
let connectionButton, audioButton, metronomeButton, recordButton, loopButton, chordsButton;
let tempo = 120;
let tempoLocked = false;
let buttonStates = [false, false, false, false];
let drumNames = ['Clap', 'Hi-hat', 'Snare', 'Kick'];
let drumColors = ['#FF9900', '#0000FF', '#00F000', '#FF0000'];
let buttonSize = 100;
let buttonSpacing = 120;
let startX = 100;
let startY = 350;
let audioInitialized = false;
let isMetronomePlaying = false;
let synths = {};
let drumSounds = {};
let metronome;
let lastPulseTime = 0;
let pulseOpacity = 0;

let isRecording = false;
let isLooping = false;
let recordedEvents = [];
let loopStartTime = 0;
let loopInterval;

let isChordsPlaying = false;
let chordLoop;

function setup() {
  createCanvas(800, 650);
  textFont('Helvetica');
  port = createSerial();

  connectionButton = createButton('Connect to Arduino');
  audioButton = createButton('Start Audio');
  metronomeButton = createButton('Start Metronome');
  recordButton = createButton('Start Recording');
  loopButton = createButton('Play Loop');
  chordsButton = createButton('Play Chords');

  let buttons = [connectionButton, audioButton, metronomeButton, recordButton, loopButton, chordsButton];

  buttons.forEach((btn, i) => {
    btn.position(30, 30 + i * 60);
    btn.style('background-color', '#4CAF50');
    btn.style('color', 'white');
    btn.style('border', 'none');
    btn.style('padding', '15px 30px');
    btn.style('border-radius', '12px');
    btn.style('cursor', 'pointer');
    btn.style('font-size', '16px');
    btn.style('font-weight', 'bold');
    btn.style('box-shadow', '2px 4px 10px rgba(0,0,0,0.2)');
    btn.style('transition', '0.3s');
    btn.mouseOver(() => btn.style('transform', 'scale(1.05)'));
    btn.mouseOut(() => btn.style('transform', 'scale(1)'));
  });

  connectionButton.mousePressed(connect);
  audioButton.mousePressed(initializeAudio);
  metronomeButton.mousePressed(toggleMetronome);
  recordButton.mousePressed(toggleRecording);
  loopButton.mousePressed(toggleLoop);
  chordsButton.mousePressed(toggleChords);

  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  drawGradientBackground(); // Moved to top so it renders correctly first

  fill(50);
  textSize(16);
  text('Status: ' + (port.opened() ? 'Connected' : 'Disconnected'), width / 2, 30);
  text('Tempo: ' + tempo + ' BPM', width / 2, 60);

  // Tempo slider
  fill(200);
  rect(width / 2 - 150, 80, 300, 20, 10);
  fill(80);
  let sliderX = map(tempo, 60, 180, width / 2 - 150, width / 2 + 150);
  ellipse(sliderX, 90, 20);
  fill(0);
  textSize(12);
  text('60', width / 2 - 160, 110);
  text('180', width / 2 + 160, 110);
  textSize(16);
  text('Tempo Control', width / 2, 120);

  // Metronome pulse
  if (millis() - lastPulseTime < 150) {
    pulseOpacity = map(millis() - lastPulseTime, 0, 150, 255, 0);
    fill(255, 50, 50, pulseOpacity);
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(255, 0, 0, pulseOpacity);
    noStroke();
    ellipse(width / 2, 150, 40 + (255 - pulseOpacity) * 0.1);
    drawingContext.shadowBlur = 0;
  }

  // Drum buttons
  for (let i = 0; i < 4; i++) {
    let x = startX + i * buttonSpacing;
    let y = startY;

    push();
    translate(x, y);
    rectMode(CENTER);

    if (buttonStates[i]) {
      fill(30);
      stroke(255);
      strokeWeight(3);
      scale(0.95);
    } else {
      fill(drumColors[i]);
      stroke(0);
      strokeWeight(2);
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = drumColors[i];
    }

    rect(100, 0, buttonSize, buttonSize, 20);
    drawingContext.shadowBlur = 0;
    fill(255);
    noStroke();
    textSize(18);
    text(drumNames[i], 100, 0);
    pop();
  }

  // UI Labels
  fill(0);
  textSize(16);
  text('Use joystick to control tempo', width / 2, height - 60);
  text('Press buttons to trigger sounds', width / 2, height - 40);
  // Serial parsing
  if (port.opened()) {
    let line = port.readUntil('\n');
    if (line.length > 0) {
      line = line.trim();
      if (line.startsWith('Tempo:')) {
        let newTempo = parseInt(line.substring(6));
        if (!tempoLocked && abs(newTempo - tempo) > 2) {
          tempo = newTempo;
          if (isMetronomePlaying) Tone.Transport.bpm.value = tempo;
        }
      } else if (line.startsWith('Button')) {
        let buttonNum = parseInt(line.charAt(7)) - 1;
        if (buttonNum >= 0 && buttonNum < 4) {
          playDrumSound(buttonNum);
          buttonStates[buttonNum] = true;
          if (isRecording) {
            recordedEvents.push({ time: Tone.now() - loopStartTime, index: buttonNum });
          }
          setTimeout(() => {
            buttonStates[buttonNum] = false;
          }, 200);
        }
      }
      else if (line === 'JoystickPressed') {
        tempoLocked = !tempoLocked;
        port.write(tempoLocked ? 'TEMPO_LOCKED' : 'TEMPO_UNLOCKED');
      }
    }
  }
}


function drawGradientBackground() {
    background(240);
    stroke(220);
    strokeWeight(1);
    for (let y = 0; y < height; y += 40) {
      line(0, y, width, y);
    }
    for (let x = 0; x < width; x += 40) {
      line(x, 0, x, height);
    }
}

function connect() {
  port.open('Arduino', 9600);
}

async function initializeAudio() {
  if (audioInitialized) return;
  try {
    await Tone.start();

    drumSounds = {
      kick: new Tone.MembraneSynth().toDestination(),
      snare: new Tone.NoiseSynth().toDestination(),
      hihat: new Tone.MetalSynth({ resonance: 8000 }).toDestination(),
      clap: new Tone.Synth().toDestination()
    };

    metronome = new Tone.Loop(time => {
      drumSounds.hihat.triggerAttackRelease("C6", "32n", time);
      lastPulseTime = millis();
    }, "4n");

    chordLoop = new Tone.Loop(time => {
      let now = Tone.now();
      let chords = [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]];
      let chord = chords[Math.floor((now * 2) % 4)];
      chord.forEach(note => new Tone.Synth().toDestination().triggerAttackRelease(note, "2n", time));
    }, "2n");

    audioInitialized = true;
    audioButton.html('Audio Started');
    audioButton.style('background-color', '#666');
    audioButton.attribute('disabled', '');
  } catch (e) {
    console.error("Audio init failed:", e);
  }
}

function toggleMetronome() {
  if (!audioInitialized) return;
  if (!isMetronomePlaying) {
    Tone.Transport.bpm.value = tempo;
    metronome.start(0);
    Tone.Transport.start();
    isMetronomePlaying = true;
    metronomeButton.html('Stop Metronome');
    metronomeButton.style('background-color', '#f44336');
  } else {
    metronome.stop();
    Tone.Transport.stop();
    isMetronomePlaying = false;
    metronomeButton.html('Start Metronome');
    metronomeButton.style('background-color', '#4CAF50');
  }
}

function playDrumSound(index) {
  if (!audioInitialized) return;
  switch (index) {
    case 0: drumSounds.clap.triggerAttackRelease("C4", "8n"); break;
    case 1: drumSounds.hihat.triggerAttackRelease("C6", "32n"); break;
    case 2: drumSounds.snare.triggerAttackRelease("16n"); break;
    case 3: drumSounds.kick.triggerAttackRelease("C1", "8n"); break;
  }
}

function toggleRecording() {
  if (!audioInitialized) return;
  isRecording = !isRecording;
  if (isRecording) {
    recordedEvents = [];
    loopStartTime = Tone.now();
    recordButton.html('Stop Recording');
    port.write('RECORDING_STARTED');
  } else {
    recordButton.html('Start Recording');
    port.write('RECORDING_STOPPED');
  }
}

function toggleLoop() {
    if (!audioInitialized || recordedEvents.length === 0) return;
  
    isLooping = !isLooping;
  
    if (isLooping) {
      Tone.Transport.stop(); // Ensure clean start
      Tone.Transport.cancel(); // Clear previous events
  
      recordedEvents.forEach(event => {
        Tone.Transport.scheduleRepeat(time => {
          playDrumSound(event.index);
        }, "4m", event.time);
      });
  
      Tone.Transport.bpm.value = tempo;
      Tone.Transport.start();
      loopButton.html('Stop Loop');
      port.write('LOOP_STARTED');
    } else {
      Tone.Transport.cancel(); // Stop scheduled events
      Tone.Transport.stop();
      loopButton.html('Play Loop');
      port.write('LOOP_STOPPED');
    }
  }
  

function toggleChords() {
  if (!audioInitialized) return;
  isChordsPlaying = !isChordsPlaying;
  if (isChordsPlaying) {
    chordLoop.start(0);
    if (!Tone.Transport.state === "started") Tone.Transport.start();
    chordsButton.html('Stop Chords');
    port.write('CHORDS_ON');
  } else {
    chordLoop.stop();
    chordsButton.html('Play Chords');
    port.write('CHORDS_OFF');
  }
}
