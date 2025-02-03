var state = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let weight = 3;
let lines = [];
let currentLine = [];
let drawingEnabled = false;


function preload()
{
    img1 = loadImage('images/plus.png');
    img2 = loadImage('images/minus.png');
    img3 = loadImage('images/undo.jpeg'); 
}

function setup() 
{
    createCanvas(400, 400);
    background(220);        //move here so it doesnt reload each frame, stopping our drawn lives to staying
    angleMode(DEGREES);
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
    }
    if(mouseX <= 20 && mouseY > 20 && mouseY <= 40)
    {
        stroke('orange');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 40 && mouseY <= 60)
    {
        stroke('yellow');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 60 && mouseY <= 80)
    {
        stroke('green');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 80 && mouseY <= 100)
    {
        stroke('cyan');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 100 && mouseY <= 120)
    {
        stroke('blue');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 120 && mouseY <= 140)
    {
        stroke('magenta');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 140 && mouseY <= 160)
    {
        stroke('brown');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 160 && mouseY <= 180)
    {
        stroke('white');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 180 && mouseY <= 200)
    {
        stroke('black');
        strokeWeight(weight);
    }
    if(mouseX <= 20 && mouseY > 200 && mouseY <= 220)
    {
        strokeWeight(weight++);
    }
    if(mouseX <= 20 && mouseY > 220 && mouseY <= 240)
    {
        strokeWeight(weight--);
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
}

  function mouseDragged()
  {
                 // stroke('red'); //same as above, change the colors above in their own distinct pockets, so they can be abstaracted and not too connected and dependent to each other 
                //strokeWeight(3); //to have stroke weight above be effected ofc dont reset it bck to 3  
   line(prevMouseX, prevMouseY, mouseX, mouseY);
  // if (drawingEnabled){currentLine.push({ x1: pmouseX, y1: pmouseY, x2: mouseX, y2: mouseY });}
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