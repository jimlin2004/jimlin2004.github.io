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

    resizeFontSize(ctx)
    {
        let reg = /^[\d|a-zA-Z]+$/;
        if (reg.test(this.val))
        {
            let font_size = (this.r * 2) / this.val.length * 2;
            ctx.font = `${font_size}px Silver`;
        }
        else
        {
            let font_size = (this.r * 2) / this.measureActualSize() * 2;
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
        if (this.val !== undefined)
        {
            this.resizeFontSize(ctx);
            let font_material = ctx.measureText(this.val);
            let t_h = font_material.actualBoundingBoxAscent + font_material.actualBoundingBoxDescent;
            ctx.fillStyle = "#000000";
            ctx.fillText(this.val, this.x - (font_material.width / 2), this.y + (t_h / 2));
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
        for (let i = 0; i < keys.length; i++)
            $("#s_type").append(new Option(keys[i], i.toString()));
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

    drawBinary(canvas)
    {
        let specification = this.splitCanvas_binary(canvas);
        // let x = specification["unitWidth"] / 2;
        let x = 0;
        let y = specification["unitHeight"] / 2;
        let r = Math.min(specification["unitWidth"] / 2, specification["unitHeight"] / 2);
        let unitWidth = 0;
        let levelElementNum = 0;
        for (let levelNum = 0; levelNum < specification["depth"]; levelNum++)
        {
            unitWidth = this.getLevelUnitWidth_binary(canvas, levelNum);
            x = unitWidth / 2;
            levelElementNum = this.getLevelMaxElementNum_binary(levelNum);
            for (let i = 0; i < levelElementNum; i++)
            {
                console.log(this.parser.levels[levelNum].nodes[i]);
            }
        }
        // for (let i = 0; i < specification["maxElementNum"]; i++)
        // {
        //     this.elements.push(new Circle(x, y, r, "100"));
        //     x += specification["unitWidth"];
        // }
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
    canvas.width = $("#content").width();
    canvas.height = $("#content").height() * 0.6;
}

$(function() {
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
        if ($("#i_data").val().length === 0)
            return;
        else
        {
            algorithmVisualizationSystem.parser.clear();
            algorithmVisualizationSystem.clear(canvas, ctx);
            algorithmVisualizationSystem.setType($("#s_type").text());
            algorithmVisualizationSystem.parser.parse($("#i_data").val());
            algorithmVisualizationSystem.parser.getLevels();
            algorithmVisualizationSystem.drawBinary(canvas);
            algorithmVisualizationSystem.drawAllElement(ctx);
            algorithmVisualizationSystem.drawSplitCanvas(canvas, ctx);
        }
    });
    fontface.load().then((font) => {
        document.fonts.add(font);
        // ctx.font = `${canvas.width * 0.08}px Silver`;
        // let circle1 = new Circle(100, 100, 30, "1234");
        // let circle2 = new Circle(200, 200, 30, "嗨");
        // algorithmVisualizationSystem.connect(ctx, circle1, circle2);
        // circle1.draw(ctx);
        // circle2.draw(ctx);
    });
});