import {Parser} from "./Parser.js"
import {RenderSystem} from "./RenderSystem.js"

class Circle
{
    constructor(x, y, r, val)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.val = val;
    }

    measureActualSize()
    {
        let num = 0;
        let reg = /^[\d|a-zA-Z]+$/;
        for (let char of this.val)
        {
            if (reg.test(char))
                num += 1;
            else
                num += 2;
        }
        return num;
    }

    resizeFontSize(ctx, val)
    {
        let reg = /^[\d|a-zA-Z]+$/;
        if (reg.test(val))
        {
            let font_size = (this.r * 2) / val.length * 2;
            if (val.length === 1)
                font_size *= 0.8;
            ctx.font = `${font_size}px Silver`;
        }
        else
        {
            let font_size = (this.r * 2) / this.measureActualSize() * 2;
            if (val.length === 1)
                font_size *= 0.8;
            ctx.font = `${font_size}px Silver`;
        }
    }

    draw(ctx, color = "#000000")
    {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
        let text = this.val.toString();
        if (this.val !== undefined)
        {
            this.resizeFontSize(ctx, text);
            let font_material = ctx.measureText(text);
            let t_h = font_material.actualBoundingBoxAscent + font_material.actualBoundingBoxDescent;
            ctx.fillStyle = "#000000";
            ctx.fillText(text, this.x - (font_material.width / 2), this.y + (t_h / 2));
        }
    }
};

class AlgorithmVisualizationSystem
{
    constructor(type)
    {
        this.data = [];
        this.elements = [];
        this.type = type;
        this.parser = new Parser(this.type);
    }

    clear(canvas, ctx)
    {
        this.elements = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setType(type)
    {
        this.type = type;
        this.parser.setType(type);
    }

    addToSelect()
    {
        let keys = Object.keys(this.parser.dataStruct)
        let s_type = document.getElementById("s_type");
        for (let i = 0; i < keys.length; i++)
            s_type.appendChild(new Option(keys[i], i.toString()));
    }
    
    connect(ctx, ele1, ele2)
    {
        RenderSystem.line(ctx, ele1.x, ele1.y, ele2.x, ele2.y);
    }

    getMaxLevelWidth()
    {
        let _max = 0;
        for (let level of this.parser.levels)
        {
            if (level.sizeWithoutNull !== 0)
            {
                _max = Math.max(_max, level.getSizeIncludingNull());
            }
        }
        return _max;
    }

    getMaxElementNum_binary()
    {
        //適用於二元樹狀結構
        let depth = this.parser.levels.length - 1; //去尾
        return Math.pow(2, depth - 1);
    }

    getLevelMaxElementNum_binary(levelNum)
    {
        return Math.pow(2, levelNum);
    }

    getLevelUnitWidth_binary(canvas, levelNum)
    {
        return canvas.width / this.getLevelMaxElementNum_binary(levelNum);
    }

    splitCanvas_binary(canvas)
    {
        let maxElementNum = this.getMaxElementNum_binary();
        let depth = this.parser.levels.length - 1; //去尾
        let unitWidth = canvas.width / maxElementNum;
        let unitHeight = canvas.height / depth;
        return {"unitWidth": unitWidth, "unitHeight": unitHeight,
                "maxElementNum": maxElementNum, "depth": depth};
    }

    drawBinary(canvas, ctx)
    {
        let specification = this.splitCanvas_binary(canvas);
        let x = 0;
        let y = specification["unitHeight"] / 2;
        let r = Math.min(specification["unitWidth"] / 2, specification["unitHeight"] / 2);
        let previousLevel = [];
        let currentLevel = [];
        
        //<第一層>
        let unitWidth = this.getLevelUnitWidth_binary(canvas, 0);
        x = unitWidth / 2;
        let circle = new Circle(x, y, r, this.parser.levels[0].nodes[0].data.val);
        this.elements.push(circle);
        previousLevel.push(circle);
        //</第一層>

        for (let levelNum = 1; levelNum < specification["depth"]; levelNum++)
        {
            currentLevel = [];
            unitWidth = this.getLevelUnitWidth_binary(canvas, levelNum);
            y += specification["unitHeight"];
            for (let node of this.parser.levels[levelNum].nodes)
            {
                if (node.data !== null)
                {
                    x = previousLevel[node.elementID.parentID - 1].x;
                    if (node.elementID.index === 1)
                        x -= unitWidth / 2;
                    else if (node.elementID.index === 2)
                        x += unitWidth / 2;
                    circle = new Circle(x, y, r, node.data.val);
                    this.elements.push(circle);
                    currentLevel.push(circle);
                    this.connect(ctx, previousLevel[node.elementID.parentID - 1], circle);
                }
            }
            previousLevel = Array.from(currentLevel);
        }
        return;
    }

    drawSplitCanvas(canvas, ctx)
    {
        let num = 4;
        let unitWidth = canvas.width / num;
        let x = 0;
        let x2 = unitWidth / 2;
        let mid = canvas.width / 2;
        RenderSystem.line(ctx, mid, 0, mid, canvas.height, 6, "#CDC673");
        for (let i = 0; i < num; i++)
        {
            x += unitWidth;
            RenderSystem.line(ctx, x, 0, x, canvas.height);
            RenderSystem.line(ctx, x2, 0, x2, canvas.height, 3, "#B22222");
            x2 += unitWidth;
        }
    }

    drawWithNull()
    {
        
    }

    drawAllElement(ctx)
    {
        for (let element of this.elements)
        {
            element.draw(ctx);
        }
    }
};

function resizeCanvasSize(canvas)
{
    canvas.width = document.getElementById("content").offsetWidth;
    canvas.height = document.getElementById("content").offsetHeight * 0.6;
}

//<execute>
let fontface = new FontFace("Silver", "url(../../font/Silver.ttf)");
const canvas = document.getElementById("main_canvas");
const ctx = canvas.getContext("2d");
resizeCanvasSize(canvas);
let algorithmVisualizationSystem = new AlgorithmVisualizationSystem("");
algorithmVisualizationSystem.addToSelect();
window.addEventListener("resize", () => {
    resizeCanvasSize(canvas);
});
const b_check = document.getElementById("b_check");
b_check.addEventListener("click", () => {
    if (document.getElementById("i_data").value.length === 0)
        return;
    else
    {
        algorithmVisualizationSystem.parser.clear();
        algorithmVisualizationSystem.clear(canvas, ctx);
        algorithmVisualizationSystem.setType(document.getElementById("s_type").options[document.getElementById("s_type").selectedIndex].text);
        algorithmVisualizationSystem.parser.parse(document.getElementById("i_data").value);
        algorithmVisualizationSystem.parser.getLevels();
        algorithmVisualizationSystem.drawBinary(canvas, ctx);
        algorithmVisualizationSystem.drawAllElement(ctx);
    }
});
fontface.load().then((font) => {
    document.fonts.add(font);
});
//</execute>