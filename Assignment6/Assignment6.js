let synth, filt, rev, polysynth, kick, snare, hihatClosed, hihatOpen;
let activeKeys = new Set();
let activeDrums = new Set();
let filterControl;

// Key-to-note mapping with shift key raising the octave
let keynotes = {
  // White notes
  'a': 'C3', 's': 'D3', 'd': 'E3', 'f': 'F3', 'g': 'G3', 'h': 'A3', 'j': 'B3', 'k': 'C4', 'l': 'D4', ';': 'E4',
  'A': 'C4', 'S': 'D4', 'D': 'E4', 'F': 'F4', 'G': 'G4', 'H': 'A4', 'J': 'B4', 'K': 'C5', 'L': 'D5', ':': 'E5',
  // Black notes
  'w': 'C#3', 'e': 'D#3', 't': 'F#3', 'y': 'G#3', 'u': 'A#3', 'o': 'C#4', 'p': 'D#4', ']': 'F#4',
  'W': 'C#4', 'E': 'D#4', 'T': 'F#4', 'Y': 'G#4', 'U': 'A#4', 'O': 'C#5', 'P': 'D#5', '}': 'F#5',
};

function setup() {
  createCanvas(600, 300);
  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  synth = new Tone.Synth().connect(rev);
  polysynth = new Tone.PolySynth(Tone.Synth).connect(rev);

  kick = new Tone.MembraneSynth().toDestination();
  snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).toDestination();
  hihatClosed = new Tone.MetalSynth({ frequency: 200, envelope: { attack: 0.01, decay: 0.1, sustain: 0 } }).toDestination();
  hihatOpen = new Tone.MetalSynth({ frequency: 200, envelope: { attack: 0.01, decay: 0.5, sustain: 0 } }).toDestination();
  
  filterControl = createSlider(200, 2000, 1000);
  filterControl.position(550, 600);
  filterControl.input(() => filt.frequency.value = filterControl.value());
}

function draw() {
  background(220);
  let x = 20;
  let whiteKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  let blackKeys = ['w', 'e', 't', 'y', 'u', 'o', 'p', ']'];
  
  // Draw white keys
  whiteKeys.forEach(k => {
    fill(activeKeys.has(k) || activeKeys.has(k.toUpperCase()) ? 'blue' : 'white');
    rect(x, 100, 40, 100);
    fill(0);
    text(k.toUpperCase(), x + 15, 190);
    x += 42;
  });
  
  x = 50;
  // Draw black keys above and in between white keys
  blackKeys.forEach(k => {
    fill(activeKeys.has(k) || activeKeys.has(k.toUpperCase()) ? 'red' : 'black');
    rect(x, 100, 30, 60);
    x += 42;
  });

  drawDrumButton(20, 20, 'Kick', '1');
  text('1', 20, 30);
  drawDrumButton(70, 20, 'Snare', '2');
  text('2', 70, 30);
  drawDrumButton(120, 20, 'HHC', '3');
  text('3', 120, 30);
  drawDrumButton(170, 20, 'HHO', '4');
  text('4', 170, 30);

  fill(0);
  text("Filter Cutoff", 40, 260);
  text("Hold Shift to raise octave", 160, 90);
}

function drawDrumButton(x, y, label, key) {
  fill(activeDrums.has(key) ? 'darkgray' : 'gray'); // Darken when pressed
  rect(x, y, 40, 40);
  fill(0);
  text(label, x + 5, y + 25);
}

function keyPressed() {
  if (keynotes[key]) {
    activeKeys.add(key);
    polysynth.triggerAttack(keynotes[key]);
  } else if (key == '1') {
    kick.triggerAttackRelease('C1', '0.2s');
    activeDrums.add('1');
  } else if (key == '2') {
    snare.triggerAttackRelease('8n');
    activeDrums.add('2');
  } else if (key == '3') {
    hihatClosed.triggerAttackRelease('16n');
    activeDrums.add('3');
  } else if (key == '4') {
    hihatOpen.triggerAttackRelease('8n');
    activeDrums.add('4');
  }
}

function keyReleased() {
  if (keynotes[key]) {
    polysynth.triggerRelease(keynotes[key]);
    activeKeys.delete(key);
    activeKeys.delete(key.toLowerCase());
  }
  activeDrums.delete(key);
}

