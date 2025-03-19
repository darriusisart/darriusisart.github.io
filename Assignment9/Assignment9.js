var state = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let weight = 3;
let lines = [];
let currentLine = [];
let drawingEnabled = false;

// Sound variables
let synths = {};
let audioInitialized = false;
let drawingSynth = null;
let lastDrawTime = 0;
let drawingSpeed = 0;
let jazzSequence = null;
let isJazzPlaying = false;

// Jazz chord progression (ii-V-I in C major)
const jazzChords = [
    ["Dm7", "G7", "CM7"],
    ["Dm7", "G7", "CM7"],
    ["Dm7", "G7", "CM7"],
    ["Dm7", "G7", "CM7"]
];

// Walking bass line
const bassNotes = [
    ["D2", "F2", "A2", "C3"],
    ["G2", "B2", "D3", "F3"],
    ["C2", "E2", "G2", "B2"]
];

function preload()
{
    img1 = loadImage('images/plus.png');
    img2 = loadImage('images/minus.png');
    img3 = loadImage('images/undo.jpeg'); 
}

async function setup() 
{
    createCanvas(400, 400);
    background(220);        //move here so it doesnt reload each frame, stopping our drawn lives to staying
    angleMode(DEGREES);
    
    // Initialize audio
    try {
        await Tone.start();
        console.log("Audio context started");
        
        // Create synths for each color
        synths = {
            red: new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            orange: new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            yellow: new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            green: new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            cyan: new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            blue: new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            magenta: new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            brown: new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            white: new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination(),
            black: new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } }).toDestination()
        };

        // Create a synth for weight changes
        synths.weight = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.10, decay: 0.1, sustain: 0.2, release: 0.2 }
        }).toDestination();

        // Create a synth for drawing
        drawingSynth = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { 
                attack: 0.001,
                decay: 0.05,
                sustain: 0.1,
                release: 0.1
            }
        }).toDestination();

        // Create jazz synths
        synths.chord = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.1 }
        }).toDestination();

        synths.bass = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 }
        }).toDestination();

        // Set volume levels
        synths.chord.volume.value = -55;
        synths.bass.volume.value = -5;
        drawingSynth.volume.value = -8;

        // Create jazz sequence
        jazzSequence = new Tone.Sequence((time, step) => {
            // Play chords
            if (step % 4 === 0) {
                const chordIndex = Math.floor(step / 4) % jazzChords.length;
                const chord = jazzChords[chordIndex][Math.floor(step / 12) % 3];
                synths.chord.triggerAttackRelease(chord, "1n", time);
            }

            // Play bass
            const bassIndex = Math.floor(step / 4) % bassNotes.length;
            const bassNote = bassNotes[bassIndex][step % 4];
            synths.bass.triggerAttackRelease(bassNote, "4n", time);
        }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "4n");

        // Start the sequence but don't start the transport yet
        jazzSequence.start();
        Tone.Transport.bpm.value = 120;
        isJazzPlaying = false;

        audioInitialized = true;
        console.log("Audio initialized successfully");
    } catch (error) {
        console.error("Error initializing audio:", error);
    }
}

function startJazzMusic() {
    if (!isJazzPlaying) {
        Tone.Transport.start();
        isJazzPlaying = true;
    }
}

function playColorSound(color) {
    if (!audioInitialized) return;
    
    const noteMap = {
        red: "C4",
        orange: "D4",
        yellow: "E4",
        green: "F4",
        cyan: "G4",
        blue: "A4",
        magenta: "B4",
        brown: "C3",
        white: "C5",
        black: "C2"
    };

    if (synths[color] && noteMap[color]) {
        synths[color].triggerAttackRelease(noteMap[color], "8n");
        startJazzMusic(); // Start music when color is selected
    }
}

function playWeightSound() {
    if (!audioInitialized) return;
    synths.weight.triggerAttackRelease("C4", "16n");
}

function draw() 
{
    strokeWeight(min(max(weight, 1), 5));
    //Red
    fill(256,0,0);
    quad(0,20,20,20,20,0,0,0);
    //Orange
    fill(256,150,0);
    quad(0,40,20,40,20,20,0,20);
    //Yellow
    fill(256,256,0);
    quad(0,60,20,60,20,40,0,40);
    //Green
    fill(0,256,0);
    quad(0,80,20,80,20,60,0,60);
    //Cyan
    fill(0,256,256);
    quad(0,100,20,100,20,80,0,80);
    //Blue
    fill(0,0,256);
    quad(0,120,20,120,20,100,0,100);
    //Magenta
    fill(256,0,256);
    quad(0,140,20,140,20,120,0,120);
    //Brown
    fill(200,125,0);
    quad(0,160,20,160,20,140,0,140);
    //White
    fill(256,256,256);
    quad(0,180,20,180,20,160,0,160);
    //Black
    fill(0,0,0);
    quad(0,200,20,200,20,180,0,180);
    //plus size
    image(img1, 0, 202, 20, 20);
    //minus size
    image(img2, 1, 223, 18, 18);
    // //undo
    // image(img3, 1, 245, 20, 20);
    // //redo
    // push();
    // translate(21, 318);
    // scale(0.1);
    // rotate(180);
    // image(img3, 1, 275);//, 20, 20);
    // pop();
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    //Used in unimplemented functions(undo,redo, toggle on/off lines that change color with you)
    // // Draw all stored lines
    // for (let storedLine of lines) 
    // {
    // for (let segment of storedLine) {
    //   line(segment.x1, segment.y1, segment.x2, segment.y2);
    // }
    // }

  // Draw the current line (if it's being drawn)
    // for (let segment of currentLine) 
    // {
    //     line(segment.x1, segment.y1, segment.x2, segment.y2);
    // }
}

function mousePressed()
{
    //outline and color change              main thing, you don't need to change the line drawn here just the color so they are abrstracted from each other and can be reused better
    if(mouseX <= 20 && mouseY <= 20)
    {
        stroke('red');
        strokeWeight(weight);
        playColorSound('red');
    }
    if(mouseX <= 20 && mouseY > 20 && mouseY <= 40)
    {
        stroke('orange');
        strokeWeight(weight);
        playColorSound('orange');
    }
    if(mouseX <= 20 && mouseY > 40 && mouseY <= 60)
    {
        stroke('yellow');
        strokeWeight(weight);
        playColorSound('yellow');
    }
    if(mouseX <= 20 && mouseY > 60 && mouseY <= 80)
    {
        stroke('green');
        strokeWeight(weight);
        playColorSound('green');
    }
    if(mouseX <= 20 && mouseY > 80 && mouseY <= 100)
    {
        stroke('cyan');
        strokeWeight(weight);
        playColorSound('cyan');
    }
    if(mouseX <= 20 && mouseY > 100 && mouseY <= 120)
    {
        stroke('blue');
        strokeWeight(weight);
        playColorSound('blue');
    }
    if(mouseX <= 20 && mouseY > 120 && mouseY <= 140)
    {
        stroke('magenta');
        strokeWeight(weight);
        playColorSound('magenta');
    }
    if(mouseX <= 20 && mouseY > 140 && mouseY <= 160)
    {
        stroke('brown');
        strokeWeight(weight);
        playColorSound('brown');
    }
    if(mouseX <= 20 && mouseY > 160 && mouseY <= 180)
    {
        stroke('white');
        strokeWeight(weight);
        playColorSound('white');
    }
    if(mouseX <= 20 && mouseY > 180 && mouseY <= 200)
    {
        stroke('black');
        strokeWeight(weight);
        playColorSound('black');
    }
    if(mouseX <= 20 && mouseY > 200 && mouseY <= 220)
    {
        strokeWeight(weight++);
        playWeightSound();
    }
    if(mouseX <= 20 && mouseY > 220 && mouseY <= 240)
    {
        strokeWeight(weight--);
        playWeightSound();
    }
    if(mouseX <= 20 && mouseY > 250 && mouseY <= 265)
    {
        drawingEnabled = !drawingEnabled;
    }    
    // //Undo   
    // if(mouseX <= 20 && mouseY > 245 && mouseY <= 260)                                                           //next follow hover then when pressed draw color how? mouseDragged is how
    // {
    //     if (lines.length > 0) 
    //     {
    //         currentLine = lines.pop(); // Move last drawn line back to currentLine
    //     }
    // }
    // //Redo
    // if(mouseX <= 20 && mouseY > 270 && mouseY <= 295)                                                          
    // {

    // }

    // Toggle jazz music
    if(mouseX <= 20 && mouseY > 265 && mouseY <= 280)
    {
        if (isJazzPlaying) {
            Tone.Transport.stop();
            isJazzPlaying = false;
        } else {
            Tone.Transport.start();
            isJazzPlaying = true;
        }
    }
}

function mouseDragged()
{
    if (!audioInitialized || !drawingSynth) return;

    // Start jazz music on first draw
    startJazzMusic();

    // Calculate drawing speed
    const currentTime = millis();
    const timeDiff = currentTime - lastDrawTime;
    const distance = dist(prevMouseX, prevMouseY, mouseX, mouseY);
    drawingSpeed = distance / timeDiff;
    
    // Map speed to frequency (faster drawing = higher pitch)
    const baseFreq = 440; // A4 (higher base frequency for more pencil-like sound)
    const maxSpeed = 20; // Maximum expected speed
    const freq = baseFreq * (1 + (drawingSpeed / maxSpeed));
    
    // Play sound with frequency based on drawing speed
    drawingSynth.triggerAttackRelease(freq, "32n");  // Shorter note duration for more pencil-like sound
    
    // Draw the line
    line(prevMouseX, prevMouseY, mouseX, mouseY);
    
    // Update for next frame
    lastDrawTime = currentTime;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

 //partially works: press once and then draw lines, those will follow color changes, but they dont stay that color after you press it again to go back to normal drawing 
//   function mouseReleased() {
//    // Store the completed line and clear currentLine
//   if (drawingEnabled && currentLine.length > 0) {
//     lines.push([...currentLine]);  // Store a copy of the array
//     currentLine = [];  // Reset for the next line
//     }
//   }

//   function toggleDrawing() {
//     drawingEnabled = !drawingEnabled;  // Toggle the state
//     console.log("Drawing mode:", drawingEnabled ? "ON" : "OFF");
//   }

                //if x in 0-20 range(if y 0-20 r, 20-40 o, 40-60 y, 60-80 g, 80-100 cy, 100-120 b, 120-140 mg, 140-160 br, 160-180 b, 180-200 w)

                //pmouseX/Y looks at mouse position from last frame, does the same thing prevMouseX/Y do in this file
                //just look at all mouse doc to figure out


                //current: plus and minus added, but not fully implemented, only on sides change and it resets back to 3 when you change color