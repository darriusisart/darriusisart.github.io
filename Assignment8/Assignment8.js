// Debug information
console.log("Script starting...");
console.log("Tone.js available:", typeof Tone !== "undefined");
console.log("p5.js available:", typeof p5 !== "undefined");

let bugs = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let gameStarted = false;
let bugSpriteSheet;
let button, part1, synth1, synth2, missSynth, startMelodySynth, startMelodyPart;
let dragging = false;
let speedMultiplier = 10;
let audioInitialized = false;

console.log("Tone.js loaded:", typeof Tone !== "undefined");

function preload() {
    bugSpriteSheet = loadImage('images/bug_spritesheet.png');
}

async function setup() {
    createCanvas(400, 400);
    textAlign(CENTER, CENTER);
    
    button = createElement("button", "Start Audio");
    button.position(0, 0);
    button.mousePressed(initializeAudio);
}

async function initializeAudio() {
    try {
        await Tone.start();
        console.log("Context has started");
        
        startMelodySynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.5,
                decay: 0.8,
                sustain: 0.4,
                release: 1.0
            },
            volume: -10
        }).toDestination();

        startMelodyPart = new Tone.Part(((time, value) => {
            startMelodySynth.triggerAttackRelease(value.note, value.dur, time);
        }),
        [
            {time: 0, note: "C4", dur: "2n"},
            {time: "2:0", note: "E4", dur: "2n"},
            {time: "4:0", note: "G4", dur: "2n"},
            {time: "6:0", note: "C5", dur: "2n"},
            {time: "8:0", note: "G4", dur: "2n"},
            {time: "10:0", note: "E4", dur: "2n"},
            {time: "12:0", note: "C4", dur: "2n"},
            {time: "14:0", note: "C4", dur: "2n"},
        ]
        ).start();
        startMelodyPart.loop = true;
        startMelodyPart.loopEnd = "16m";

        synth1 = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.8,
                release: 0.5
            }
        }).toDestination();
        
        synth2 = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.05,
                decay: 0.1,
                sustain: 0.6,
                release: 0.3
            }
        }).toDestination();

        missSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.2,
                release: 0.2
            }
        }).toDestination();

        Tone.Transport.timeSignature = [4, 4];
        Tone.Transport.bpm = 60;
        Tone.Transport.start();

        part1 = new Tone.Part(((time, value) => {
            synth1.triggerAttackRelease(value.note, value.dur, time);
        }),
        [
            {time: 0, note: "C2", dur: "2n"},
            {time: "2:0", note: "F2", dur: "2n"},
            {time: "4:0", note: "G2", dur: "2n"},
            {time: "6:0", note: "C2", dur: "2n"},
            {time: "0:1", note: ["C4", "E4", "G4", "B4"], dur: "4n"},
            {time: "1:1", note: ["D4", "F4", "A4", "C5"], dur: "4n"},
            {time: "2:1", note: ["F4", "A4", "C5", "E5"], dur: "4n"},
            {time: "3:1", note: ["G4", "B4", "D5", "F5"], dur: "4n"},
            {time: "4:1", note: ["C4", "E4", "G4", "B4"], dur: "4n"},
            {time: "5:1", note: ["D4", "F4", "A4", "C5"], dur: "4n"},
            {time: "6:1", note: ["F4", "A4", "C5", "E5"], dur: "4n"},
            {time: "7:1", note: ["G4", "B4", "D5", "F5"], dur: "4n"},
        ]
        ).start();
        part1.loop = true;
        part1.loopEnd = "8m";

        audioInitialized = true;
        button.remove();
        console.log("Audio initialized successfully");
    } catch (error) {
        console.error("Error initializing audio:", error);
    }
}

function startGame() {
    if (!audioInitialized) {
        console.log("Please initialize audio first");
        return;
    }
    
    gameStarted = true;
    gameOver = false;
    score = 0;
    timeLeft = 30;
    speedMultiplier = 10;
    bugs = [];
    
    startMelodyPart.stop();
    Tone.Transport.bpm = 75;
    part1.start();
    
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height), bugSpriteSheet));
    }
    
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            gameOver = true;
        }
    }, 1000);
}

function draw() {
    background(220);

    if (!gameStarted) {
        displayStartScreen();
    } else if (!gameOver) {
        for (let bug of bugs) {
            bug.move();
            bug.display();
        }
        displayScore();
        displayTimer();
    } else {
        displayGameOver();
    }
}

function mousePressed() {
    if (!gameStarted) {
        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
            mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
            startGame();
        }
    } else if (gameOver) {
        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
            mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
            startGame();
        }
    } else {
        let hitBug = false;
        for (let bug of bugs) {
            if (bug.isClicked(mouseX, mouseY)) {
                bug.squish();
                score++;
                synth2.triggerAttackRelease("C4", "16n");
                hitBug = true;
            }
        }
        if (!hitBug) {
            missSynth.triggerAttackRelease("G2", "32n");
        }
    }
}

class SpriteAnimation {
    constructor(spriteSheet, startU, startV, duration, flipped = false) {
        this.spriteSheet = spriteSheet;
        this.u = startU;
        this.v = startV;
        this.duration = duration;
        this.startU = startU;
        this.frameCount = 0;
        this.flipped = flipped;
    }

    draw(x, y) {
        push();
        translate(x, y);
        if (this.flipped) {
            scale(-1, 1);
            translate(-80, 0);
        }
        image(this.spriteSheet, 0, 0, 64, 64, this.u * 64, this.v * 64, 64, 64);
        pop();
        
        this.frameCount++;
        if (this.frameCount % 5 === 0) {
            this.u++;
        }
        if (this.u >= this.startU + this.duration) {
            this.u = this.startU;
        }
    }
}

class Bug {
    constructor(x, y, spriteSheet) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = 0.3;
        this.isSquished = false;
        this.squishTime = 0;
        this.spriteSheet = spriteSheet;

        this.dx = random([-1, 1]) * this.speed;
        this.dy = random([-1, 1]) * this.speed;

        this.movementAnimation = new SpriteAnimation(spriteSheet, 0, 0, 4);
        this.squishAnimation = new SpriteAnimation(spriteSheet, 7, 0, 5);
        this.currentAnimation = this.movementAnimation;
    }

    move() {
        if (!this.isSquished) {
            if (frameCount % 30 === 0) { 
                let angle = random(TWO_PI);
                this.dx = cos(angle) * this.speed * speedMultiplier;
                this.dy = sin(angle) * this.speed * speedMultiplier;
            }
    
            this.x += this.dx;
            this.y += this.dy;
    
            this.x = constrain(this.x, 0, width - this.size);
            this.y = constrain(this.y, 0, height - this.size);
        }
    }

    display() {
        let flipped = this.dx < 0;
        this.currentAnimation.flipped = flipped;
        this.currentAnimation.draw(this.x, this.y);

        if (this.isSquished && millis() - this.squishTime > 500) {
            this.isSquished = false;
            this.x = random(width);
            this.y = random(height);
            this.currentAnimation = this.movementAnimation;
        }
    }

    isClicked(mx, my) {
        return !this.isSquished && dist(mx, my, this.x + this.size / 2, this.y + this.size / 2) < this.size / 2;
    }

    squish() {
        this.isSquished = true;
        this.squishTime = millis();
        this.currentAnimation = this.squishAnimation;
        speedMultiplier += 2.5;
        
        let newTempo = map(speedMultiplier, 10, 25, 75, 240, true);
        Tone.Transport.bpm.rampTo(newTempo, 0.3); 
    }
}

function displayScore() {
    fill(0);
    textSize(20);
    textFont("Monaco");
    text(`Score: ${score}`, 50, 30);
}

function displayTimer() {
    fill(0);
    textSize(20);
    textFont("Monaco");
    text(`Time Left: ${timeLeft}`, width - 70, 30);
}

function displayStartScreen() {
    // Gradient background
    for (let i = 0; i < height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color(170, 160, 100), color(100, 150, 200), inter);
        stroke(c);
        line(0, i, width, i);
    }

    // Animated circles in the background
    for (let i = 0; i < 5; i++) {
        let x = width/2 + sin(frameCount * 0.02 + i) * 100;
        let y = height/2 + cos(frameCount * 0.02 + i) * 100;
        noStroke();
        fill(255, 255, 255, 50);
        circle(x, y, 30);
    }

    fill(0, 0, 0, 100);
    textSize(42);
    textFont("Monaco");
    text("Bug Squish Game", width/2 + 2, height/3 + 2);
    
    fill(255);
    textSize(40);
    textFont("Monaco");
    text("Bug Squish Game", width/2, height/3);

    // Animated start button
    let buttonHover = dist(mouseX, mouseY, width/2, height/2) < 50;
    let buttonColor = buttonHover ? color(120, 0, 120) : color(100, 0, 100);
    fill(buttonColor);
    rect(width/2 - 50, height/2 - 25, 100, 50, 10);
    
    fill(255);
    textSize(20);
    textFont("Monaco");
    text("Start", width/2, height/2);

    fill(255, 255, 255, 200);
    textSize(16);
    textFont("Monaco");
    text("Click bugs to squish them!", width/2, height * 0.7);
    text("Try to get the highest score!", width/2, height * 0.7 + 20);
}

function displayGameOver() {
    background(200, 50, 50);
    fill(255);
    textSize(40);
    textFont("Monaco");
    text(`Game Over! Score: ${score}`, width / 2, height / 2 - 50);

    fill(100, 0, 100);
    rect(width / 2 - 50, height / 2 + 50, 100, 50, 10);
    fill(255);
    textSize(20);
    textFont("Monaco");
    text("Restart", width / 2, height / 2 + 75);
}