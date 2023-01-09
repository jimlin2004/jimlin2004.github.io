import {Deque} from "../../../js/datastructure/deque.js";

//常數
const GRID_SIZE = 20;
let RUNNING = false;

class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
};

class Grid
{
    constructor(canvasWidth, canvasHeight)
    {   
        this.size = GRID_SIZE;
        //2D array and fill 0
        this.cells = new Array(this.size).fill(0).map((row) => new Array(this.size).fill(0));
        this.cellWidth = Math.min(canvasWidth, canvasHeight) / this.size;
        this.cellHeight = this.cellWidth;
        this.origin = new Point((canvasWidth / 2) - (this.size / 2 * this.cellWidth), 0);
        this.endPoint = new Point((canvasWidth / 2) + (this.size / 2 * this.cellWidth), (canvasHeight / 2) + (this.size / 2 * this.cellHeight));
    }
    resize(canvasWidth, canvasHeight)
    {
        this.cellWidth = Math.min(canvasWidth, canvasHeight) / this.size;
        this.cellHeight = this.cellWidth;
        this.origin = new Point((canvasWidth / 2) - (this.size / 2 * this.cellWidth), 0);
        this.endPoint = new Point((canvasWidth / 2) + (this.size / 2 * this.cellWidth), (canvasHeight / 2) + (this.size / 2 * this.cellHeight));
    }
    renderGrid(ctx)
    {
        // ctx.beginPath();
        for (let i = 0; i <= this.size; ++i)
        {
            ctx.moveTo(this.origin.x + (i * this.cellWidth), 0);
            ctx.lineTo(this.origin.x + (i * this.cellWidth), this.endPoint.y);
            ctx.moveTo(this.origin.x, this.origin.y + (i * this.cellHeight));
            ctx.lineTo(this.endPoint.x, this.origin.y + (i * this.cellHeight));
        }
        // ctx.stroke();
    }
    renderCell(ctx, x, y)
    {
        ctx.fillRect(this.origin.x + (x * this.cellWidth), this.origin.y + (y * this.cellHeight), this.cellWidth, this.cellHeight);
        this.cells[y][x] = 1;
    }
    clearCell(x, y)
    {
        // ctx.clearRect(this.origin.x + (x * this.cellWidth), this.origin.y + (y * this.cellHeight), this.cellWidth, this.cellHeight);
        this.cells[y][x] = 0;
    }
    isCollision(x, y)
    {
        return (this.cells[y][x] === 0);
    }
    renderFood(ctx, x, y)
    {
        ctx.fillRect(this.origin.x + (x * this.cellWidth), this.origin.y + (y * this.cellHeight), this.cellWidth, this.cellHeight);
        this.cells[y][x] = 2;
    }
};

class Food
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
    createFood(grid)
    {
        this.x = Math.floor(Math.random() * GRID_SIZE);
        this.y = Math.floor(Math.random() * GRID_SIZE);
        if (!grid.isCollision(this.x, this.y))
            this.createFood(grid);
    }
    render(ctx, grid)
    {
        ctx.fillStyle = "red";
        grid.renderFood(ctx, this.x, this.y);
        ctx.fillStyle = "black";
    }
};

class SnakeNode
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    setPosition(x, y)
    {
        x %= GRID_SIZE;
        y %= GRID_SIZE;
        this.x = (x >= 0) ? x : GRID_SIZE - 1;
        this.y = (y >= 0) ? y : GRID_SIZE - 1;
    }
};

class Snake
{
    constructor()
    {
        this.directionVec = {x: 0, y: 0};
        this.head = new SnakeNode(0, 0);
        this.body = new Deque() //放point
        this.body.push_back(new Point(this.head.x, this.head.y));
        this.tail = null; //紀錄尾巴
        this.ateFood = false;
        this.changDirection(1, 0); //開始移動
    }
    changDirection(x, y)
    {
        if (-1 * x === this.directionVec.x && -1 * y === this.directionVec.y)
            return;
        this.directionVec.x = x;
        this.directionVec.y = y;
    }
    creatTail()
    {
        this.ateFood = true;
    }
    move()
    {
        this.head.setPosition(this.head.x + this.directionVec.x, this.head.y + this.directionVec.y);
        this.body.push_back(new Point(this.head.x, this.head.y));
    }
    render(ctx, grid)
    {
        if (this.ateFood)
            this.ateFood = false; //吃到食物不清空tail
        else
        {
            //清空tail的grid cell 由1變0
            this.tail = this.body.front();
            grid.clearCell(this.tail.x, this.tail.y);
            this.body.pop_front();
        }
        let current = this.body.first;
        while (current !== null)
        {
            grid.renderCell(ctx, current.data.x, current.data.y);
            current = current.next;
        }
    }
};

let canvas = document.getElementById("window-canvas");
canvas.width = document.getElementById("window").offsetWidth * 0.9;
canvas.height = document.getElementById("window").offsetHeight * 0.95;
let ctx = canvas.getContext("2d");
let grid = new Grid(canvas.width, canvas.height);
let snake = new Snake();
let upKey = document.getElementById("up-key");
let rightKey = document.getElementById("right-key");
let downKey = document.getElementById("down-key");
let leftKey = document.getElementById("left-key");
let ABtn = document.getElementById("A-btn");
let BBtn = document.getElementById("B-btn");
let resizeTimer = null; //用於resize end event
let food = new Food();

function resize()
{
    canvas = document.getElementById("window-canvas");
    canvas.width = document.getElementById("window").offsetWidth * 0.9;
    canvas.height = document.getElementById("window").offsetHeight * 0.95;
    ctx = canvas.getContext("2d");
    grid.resize(canvas.width, canvas.height);
    grid.renderGrid(ctx, canvas.width, canvas.height);
    snake.render(ctx, grid);
}

function upKeyEvent()
{
    snake.changDirection(0, -1);
}

function upKeyDownEvent()
{
    upKey.classList.add("active");
    upKeyEvent();
}

function upKeyUpEvent()
{
    upKey.classList.remove("active");
}

function leftKeyEvent()
{
    snake.changDirection(-1, 0);
}

function leftKeyDownEvent()
{
    leftKey.classList.add("active");
    leftKeyEvent();
}

function leftKeyUpEvent()
{
    leftKey.classList.remove("active");
}

function downKeyEvent()
{
    snake.changDirection(0, 1);
}

function downKeyDownEvent()
{
    downKey.classList.add("active");
    downKeyEvent();
}

function downKeyUpEvent()
{
    downKey.classList.remove("active");
}

function rightKeyEvent()
{
    snake.changDirection(1, 0);
}

function rightKeyDownEvent()
{
    rightKey.classList.add("active");
    rightKeyEvent();
}

function rightKeyUpEvent()
{
    rightKey.classList.remove("active");
}

function ABtnEvent()
{
    RUNNING = true;
}

function ABtnDownEvent()
{
    ABtnEvent();
    ABtn.classList.add("active");
}

function ABtnUpEvent()
{
    ABtn.classList.remove("active");
}

function BBtnEvent()
{
    console.log(grid.cells);
}

function BBtnDownEvent()
{
    BBtn.classList.add("active");
    BBtnEvent();
}

function BBtnUpEvent()
{
    BBtn.classList.remove("active");
}

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, resizeTimer);
});

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

//game
let gameInterval;

function gameLoop()
{
    if (RUNNING)
    {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        grid.renderGrid(ctx);
        snake.move();
        if (grid.cells[snake.head.y][snake.head.x] == 2)
        {
            snake.creatTail();
            food.createFood(grid);
        }
        else if(grid.cells[snake.head.y][snake.head.x] == 1)
        {
            RUNNING = false;
            clearInterval(gameInterval);
        }
        snake.render(ctx, grid);
        food.render(ctx, grid);
        ctx.stroke();
        ctx.closePath();
    }
}

function gameBegin()
{
    food.createFood(grid);
    gameInterval = setInterval(gameLoop, 200);
}

gameLoop();
gameBegin();