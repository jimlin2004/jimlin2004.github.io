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
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
}

class Snake
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.head = new SnakeNode(50, 50);
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

//canvas
let canvas = document.getElementById("window-canvas");
let ctx = canvas.getContext("2d");
let snake = new Snake();
snake.render(ctx);

function upKeyEvent()
{
    console.log("Up");
    snake.move(0, -1);
}

function leftKeyEvent()
{
    console.log("Left");
    snake.move(-1, 0);
}

function downKeyEvent()
{
    console.log("Down");
    snake.move(0, 1);
}

function rightKeyEvent()
{
    console.log("Right");
    snake.move(1, 0);
}

function ABtnEvent()
{
    console.log("A");
}

function BBtnEvent()
{
    console.log("B");
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
            downKeyEvent();
            break;
        case "Up":
        case "ArrowUp":
        case "w":
            upKeyEvent();
            break;
        case "Left":
        case "ArrowLeft":
        case "a":
            leftKeyEvent();
            break;
        case "Right": 
        case "ArrowRight":
        case "d":
            rightKeyEvent();
            break;
        case "o":
            ABtnEvent();
            break;
        case "p":
            BBtnEvent();
            break;
        default:
            return;
    }
});


