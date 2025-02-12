function preload() 
{
    green = loadImage("images/Green.png");
    goldMonk = loadImage("images/GoldMonk.png");
    mainGuy = loadImage('images/MainGuy.png');
}

function setup() 
{
    createCanvas(400, 400);
    character = new Character(random(0, width / 2), random(0, height / 2));
    character.addAnimation("down", new SpriteAnimation(green, 6, 5, 6));
    character.addAnimation("up", new SpriteAnimation(green, 0, 5, 6));
    character.addAnimation("left", new SpriteAnimation(green, 0, 0, 6, true));
    character.addAnimation("right", new SpriteAnimation(green, 0, 0, 6, false));
    character.addAnimation("idle", new SpriteAnimation(green, 0, 0, 1));
    character.currentAnimation = "idle";
    character1 = new Character(random(0, width / 2), random(0, height / 2));
    character1.addAnimation("down", new SpriteAnimation(goldMonk, 6, 5, 6));
    character1.addAnimation("up", new SpriteAnimation(goldMonk, 0, 5, 6));
    character1.addAnimation("left", new SpriteAnimation(goldMonk, 0, 0, 6, true));
    character1.addAnimation("right", new SpriteAnimation(goldMonk, 0, 0, 6, false));
    character1.addAnimation("idle", new SpriteAnimation(goldMonk, 0, 0, 1));
    character1.currentAnimation = "idle";
    character2 = new Character(random(0, width / 2), random(0, height / 2));
    character2.addAnimation("down", new SpriteAnimation(mainGuy, 6, 5, 6));
    character2.addAnimation("up", new SpriteAnimation(mainGuy, 0, 5, 6));
    character2.addAnimation("left", new SpriteAnimation(mainGuy, 0, 0, 6, true));
    character2.addAnimation("right", new SpriteAnimation(mainGuy, 0, 0, 6, false));
    character2.addAnimation("idle", new SpriteAnimation(mainGuy, 0, 0, 1));
    character2.currentAnimation = "idle";
}

function draw() 
{
    background(255);
    character.draw();
    character1.draw();
    character2.draw();
}

function keyPressed() 
{
    switch (keyCode) 
    {
        case UP_ARROW:
            character.currentAnimation = "up";
            character1.currentAnimation = "up";
            character2.currentAnimation = "up";
            break;
        case DOWN_ARROW:
            character.currentAnimation = "down";
            character1.currentAnimation = "down";
            character2.currentAnimation = "down";
            break;
        case LEFT_ARROW:
            character.currentAnimation = "left";
            character1.currentAnimation = "left";
            character2.currentAnimation = "left";
            break;
        case RIGHT_ARROW:
            character.currentAnimation = "right";
            character1.currentAnimation = "right";
            character2.currentAnimation = "right";
            break;

        //green
        case 87: //W
            character.currentAnimation = "up";
            break;
        case 83: //S
            character.currentAnimation = "down";
            break;
        case 65: //A
            character.currentAnimation = "left";
            break;
        case 68: //D
            character.currentAnimation = "right";
            break;
    
        //goldmonk
        case 85: //U
            character1.currentAnimation = "up";
            break;
        case 74: //J
            character1.currentAnimation = "down";
            break;
        case 72: //H
            character1.currentAnimation = "left";
            break;
        case 75: //K
            character1.currentAnimation = "right";
            break;    
         
        //mainguy    
        case 80: //P
            character2.currentAnimation = "up";
            break;
        case 186: //;
            character2.currentAnimation = "down";
            break;
        case 76: //L
            character2.currentAnimation = "left";
            break;
        case 222: //'
            character2.currentAnimation = "right";
            break;  
    }
}

function keyReleased() 
{
    character.currentAnimation = "idle";
    character1.currentAnimation = "idle";
    character2.currentAnimation = "idle";
}

class SpriteAnimation 
{
    constructor(spriteSheet, startU, startV, duration, flipped = false) 
    {
        this.spriteSheet = spriteSheet;
        this.u = startU;
        this.v = startV;
        this.duration = duration;
        this.startU = startU;
        this.frameCount = 0;
        this.flipped = flipped;
    }
    draw() {
        push();
        if (this.flipped) 
        {
            scale(-1, 1);
            translate(-80, 0);
        }
        image(this.spriteSheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
        pop();
        
        this.frameCount++;
        if (this.frameCount % 5 === 0) 
        {
            this.u++;
        }
        if (this.u === this.startU + this.duration) 
        {
            this.u = this.startU;
        }
    }
}

class Character 
{
    constructor(x, y) 
    {
        this.x = x;
        this.y = y;
        this.currentAnimation = null;
        this.moving = false;
        this.animations = [];
    }
    addAnimation(key, animation) 
    {
        this.animations[key] = animation;
    }
    draw() 
    {
        let animation = this.animations[this.currentAnimation];
        if (animation) 
        {
            switch (this.currentAnimation) 
            {
                case "up":
                    this.y = max(this.y - 2, 0);
                    break;
                case "down":
                    this.y = min(this.y + 2, height - 80);
                    break;
                case "left":
                    this.x = max(this.x - 2, 0);
                    break;
                case "right":
                    this.x = min(this.x + 2, width - 80);
                    break;
            }
            push();
            translate(this.x, this.y);
            animation.draw();
            pop();
            this.moving = true;
        }
        else
        this.moving = false;
    }
}