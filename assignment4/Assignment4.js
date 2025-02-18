let bugs = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let gameStarted = false;
let bugSpriteSheet;

function preload() {
    bugSpriteSheet = loadImage('images/bug_spritesheet.png');   
}

function setup() {
    createCanvas(400, 400);
    textAlign(CENTER, CENTER);
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    timeLeft = 30;
    bugs = [];
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
        for (let bug of bugs) {
            if (bug.isClicked(mouseX, mouseY)) {
                bug.squish();
                score++;
            }
        }
    }
}

// Sprite Animation Class
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
let speedMultiplier = 10; // increases with each squish

// Bug Class with Animated Sprites
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

        // Movement Animation
        this.movementAnimation = new SpriteAnimation(spriteSheet, 0, 0, 4);
        // Squish Animation (Frames 5-11)
        this.squishAnimation = new SpriteAnimation(spriteSheet, 7, 0, 5);
        this.currentAnimation = this.movementAnimation;
    }

    move() {
        if (!this.isSquished) {
            // Only update direction occasionally to reduce jitter
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
        let flipped = this.dx < 0; // Flip when moving left
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
    background(170, 16, 100);
    fill(255);
    textSize(40);
    textFont("Monaco");
    text("Bug Squish Game", width / 2, height / 3);

    fill(100, 0, 100);
    rect(width / 2 - 50, height / 2 - 25, 100, 50, 10);
    fill(255);
    textSize(20);
    textFont("Monaco");
    text("Start", width / 2, height / 2);
}

function displayGameOver() {
    background(200, 50, 50);
    fill(255);
    textSize(40);
    textFont("Monaco");
    text(`Game Over! Score: ${score}`, width / 2, height / 2 - 50);

    fill(0, 155, 0);
    rect(width / 2 - 50, height / 2 + 50, 100, 50, 10);
    fill(255);
    textSize(20);
    textFont("Monaco");
    text("Restart", width / 2, height / 2 + 75);
}
