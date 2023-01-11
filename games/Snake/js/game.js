import { Deque } from "../../../js/datastructure/deque.js";
import { FSMState, FSM } from "../../../js/FSM.js";

//常數
const GRID_SIZE = 20;
let RUNNING = false;
let END = false;

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
        this.origin = new Point((canvasWidth / 2) - (this.size / 2 * this.cellWidth), (canvasHeight / 2) - (this.size / 2 * this.cellHeight));
        this.endPoint = new Point((canvasWidth / 2) + (this.size / 2 * this.cellWidth), (canvasHeight / 2) + (this.size / 2 * this.cellHeight));
    }
    resize(canvasWidth, canvasHeight)
    {
        this.cellWidth = Math.min(canvasWidth, canvasHeight) / this.size;
        this.cellHeight = this.cellWidth;
        this.origin = new Point((canvasWidth / 2) - (this.size / 2 * this.cellWidth), (canvasHeight / 2) - (this.size / 2 * this.cellHeight));
        this.endPoint = new Point((canvasWidth / 2) + (this.size / 2 * this.cellWidth), (canvasHeight / 2) + (this.size / 2 * this.cellHeight));
    }
    renderGrid(ctx)
    {
        ctx.beginPath();
        ctx.strokeStyle = "#f4f3ee";
        for (let i = 0; i <= this.size; ++i)
        {
            ctx.moveTo(this.origin.x + (i * this.cellWidth), this.origin.y);
            ctx.lineTo(this.origin.x + (i * this.cellWidth), this.endPoint.y);
            ctx.moveTo(this.origin.x, this.origin.y + (i * this.cellHeight));
            ctx.lineTo(this.endPoint.x, this.origin.y + (i * this.cellHeight));
        }
        ctx.stroke();
        ctx.closePath();
    }
    renderCell(ctx, x, y)
    {
        ctx.fillRect(this.origin.x + (x * this.cellWidth), this.origin.y + (y * this.cellHeight), this.cellWidth, this.cellHeight);
        this.cells[y][x] = 1;
    }
    clearCell(x, y)
    {
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
        ctx.fillStyle = "#ef233c";
        grid.renderFood(ctx, this.x, this.y);
        ctx.fillStyle = "#293241";
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
        this.speed = 200;
        this.bodyLength = 1;
        this.speedCount = 1;
    }
    changDirection(x, y)
    {
        if (-1 * x === this.directionVec.x && -1 * y === this.directionVec.y)
            return;
        this.directionVec.x = x;
        this.directionVec.y = y;
    }
    createTail()
    {
        this.ateFood = true;
        this.bodyLength++;
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
canvas.width = document.getElementById("window").getBoundingClientRect().width;
canvas.height = document.getElementById("window").getBoundingClientRect().height;
let ctx = canvas.getContext("2d");
let grid = new Grid(canvas.width, canvas.height);
let snake = new Snake();
let upKey = document.getElementById("up-key");
let rightKey = document.getElementById("right-key");
let downKey = document.getElementById("down-key");
let leftKey = document.getElementById("left-key");
let ABtn = document.getElementById("A-btn");
let BBtn = document.getElementById("B-btn");
let ABtnFSM = new FSM();
let BBtnFSM = new FSM();
let resizeTimer = null; //用於resize end event
let food = new Food();
//gameInterval
let gameInterval = null;
let scoreTable = document.getElementById("score-table");

function resize()
{
    canvas = document.getElementById("window-canvas");
    canvas.width = document.getElementById("window").getBoundingClientRect().width;
    canvas.height = document.getElementById("window").getBoundingClientRect().height;
    ctx = canvas.getContext("2d");
    grid.resize(canvas.width, canvas.height);
    if (!RUNNING)
        return;
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
    ABtnFSM.triggerEvent(ABtnFSM.current);
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
    BBtnFSM.triggerEvent(BBtnFSM.current);
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

function updateScore()
{
    scoreTable.innerHTML = "Score: " + snake.bodyLength.toString();
}

function changeSpeed()
{
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, snake.speed);
}

function gameLoop()
{
    if (RUNNING)
    {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        snake.move();
        if (grid.cells[snake.head.y][snake.head.x] == 2)
        {
            snake.createTail();
            snake.speedCount++;
            food.createFood(grid);
            updateScore();
        }
        else if(grid.cells[snake.head.y][snake.head.x] == 1)
        {
            RUNNING = false;
            clearInterval(gameInterval);
            ABtnFSM.to("end");
            ABtnFSM.triggerEvent();
        }
        snake.render(ctx, grid);
        food.render(ctx, grid);
        grid.renderGrid(ctx);
        if (snake.speedCount == 5)
        {
            snake.speedCount = 0;
            snake.speed -= 10;
            if (snake.speed < 50)
                snake.speed = 50;
            changeSpeed();
            return;
        }
    }
}

function gameBegin()
{
    food.createFood(grid);
    updateScore();
    gameInterval = setInterval(gameLoop, snake.speed);
}

function reset()
{
    ctx = canvas.getContext("2d");
    grid = new Grid(canvas.width, canvas.height);
    snake = new Snake();
    food = new Food();
    updateScore();
}

//ABnt FSM
ABtnFSM.create(new FSMState("startMenu", "startMenu", "gameRunning", () => {
    document.getElementById("start-menu").classList.add("active");
    gameBegin();
    ABtnFSM.to("gameRunning");
    ABtnFSM.triggerEvent();
}));
ABtnFSM.create(new FSMState("gameRunning", "startMenu", "end", () => {
    RUNNING = true;
}));
ABtnFSM.create(new FSMState("end", "gameRunning", "gameRunning", () => {
    if (!END)
    {
        END = true;
        document.getElementById("end-menu").classList.add("active");
    }
    else
    {
        END = false;
        ABtnFSM.to("gameRunning");
        ABtnFSM.triggerEvent();
        reset();
        document.getElementById("end-menu").classList.remove("active");
        gameBegin();
    }
}));
ABtnFSM.setInit("startMenu");
//BBnt FSM
BBtnFSM.create(new FSMState("gameRunning", "gameRunning", "pause", () => {
    if (!RUNNING)
        return;
    document.getElementById("pause-menu").classList.add("active");
    if (gameInterval)
        clearInterval(gameInterval);
    BBtnFSM.to("pause");
}));
BBtnFSM.create(new FSMState("pause", "gameRunning", "gameRunning", () => {
    document.getElementById("pause-menu").classList.remove("active");
    gameInterval = setInterval(gameLoop, snake.speed);
    BBtnFSM.to("gameRunning");
}));
BBtnFSM.setInit("gameRunning");

document.querySelector("cpt-modal").open();