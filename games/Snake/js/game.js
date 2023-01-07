class Grid
{
    constructor(canvasWidth, canvasHeight)
    {   
        this.size = 8;
        //2D array and fill 0
        this.cells = new Array(this.size).fill(0).map((row) => new Array(this.size).fill(0));
        this.cellWidth = Math.min(canvasWidth, canvasHeight) / this.size;
        this.cellHeight = this.cellWidth;
    }
};

class SnakeNode
{
    constructor(w, h)
    {
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
    }
    setPosition(x, y)
    {
        console.log(x);
        this.x = x;
        this.y = y;
    }
    render(ctx)
    {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Snake
{
    constructor(w, h)
    {
        this.x = 0;
        this.y = 0;
        this.head = new SnakeNode(w, h);
    }
    move(x, y)
    {
        this.x += x;
        this.y += y;
        this.head.setPosition(this.x, this.y);
    }
    render(ctx)
    {
        this.head.render(ctx);
    }
}

let canvas = document.getElementById("window-canvas");
canvas.width = document.getElementById("window").offsetWidth * 0.9;
canvas.height = document.getElementById("window").offsetHeight * 0.95;
let ctx = canvas.getContext("2d");
let grid = new Grid(canvas.width, canvas.height);
let snake = new Snake(grid.cellWidth, grid.cellHeight);
snake.render(ctx);
let upKey = document.getElementById("up-key");
let rightKey = document.getElementById("right-key");
let downKey = document.getElementById("down-key");
let leftKey = document.getElementById("left-key");
let ABtn = document.getElementById("A-btn");
let BBtn = document.getElementById("B-btn");

function upKeyEvent()
{
    snake.move(0, -1);
}

function upKeyDownEvent()
{
    console.log("Up");
    upKey.classList.add("active");
    upKeyEvent();
}

function upKeyUpEvent()
{
    console.log("Up");
    upKey.classList.remove("active");
}

function leftKeyEvent()
{
    snake.move(-1, 0);
}

function leftKeyDownEvent()
{
    console.log("Left");
    leftKey.classList.add("active");
    leftKeyEvent();
}

function leftKeyUpEvent()
{
    console.log("Left");
    leftKey.classList.remove("active");
}

function downKeyEvent()
{
    snake.move(0, 1);
}

function downKeyDownEvent()
{
    console.log("Down");
    downKey.classList.add("active");
    downKeyEvent();
}

function downKeyUpEvent()
{
    console.log("Down");
    downKey.classList.remove("active");
}

function rightKeyEvent()
{
    snake.move(1, 0);
}

function rightKeyDownEvent()
{
    console.log("Right");
    rightKey.classList.add("active");
    rightKeyEvent();
}

function rightKeyUpEvent()
{
    console.log("Right");
    rightKey.classList.remove("active");
}

function ABtnEvent()
{
    console.log("A");
}

function ABtnDownEvent()
{
    console.log("A");
    ABtn.classList.add("active");
}

function ABtnUpEvent()
{
    console.log("A");
    ABtn.classList.remove("active");
}

function BBtnEvent()
{
    console.log("B");
}

function BBtnDownEvent()
{
    console.log("B");
    BBtn.classList.add("active");
}

function BBtnUpEvent()
{
    console.log("B");
    BBtn.classList.remove("active");
}

document.getElementById("up-key").addEventListener("click", upKeyEvent);

document.getElementById("left-key").addEventListener("click", leftKeyEvent);

document.getElementById("right-key").addEventListener("click", rightKeyEvent);

document.getElementById("down-key").addEventListener("click", downKeyEvent);

document.getElementById("A-btn").addEventListener("click", ABtnEvent);

document.getElementById("B-btn").addEventListener("click", BBtnEvent);

document.addEventListener("keydown", (e) => {
    switch (e.key)
    {
        case "Down":
        case "ArrowDown":
        case "s":
            downKeyDownEvent();
            break;
        case "Up":
        case "ArrowUp":
        case "w":
            upKeyDownEvent();
            break;
        case "Left":
        case "ArrowLeft":
        case "a":
            leftKeyDownEvent();
            break;
        case "Right": 
        case "ArrowRight":
        case "d":
            rightKeyDownEvent();
            break;
        case "o":
            ABtnDownEvent();
            break;
        case "p":
            BBtnDownEvent();
            break;
        default:
            return;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key)
    {
        case "Down":
        case "ArrowDown":
        case "s":
            downKeyUpEvent();
            break;
        case "Up":
        case "ArrowUp":
        case "w":
            upKeyUpEvent();
            break;
        case "Left":
        case "ArrowLeft":
        case "a":
            leftKeyUpEvent();
            break;
        case "Right": 
        case "ArrowRight":
        case "d":
            rightKeyUpEvent();
            break;
        case "o":
            ABtnUpEvent();
            break;
        case "p":
            BBtnUpEvent();
            break;
        default:
            return;
    }
});