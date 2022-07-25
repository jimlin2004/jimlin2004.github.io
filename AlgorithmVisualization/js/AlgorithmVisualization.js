import {Parser} from "./Parser.js"

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

    draw(ctx)
    {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000000";
        if (this.val !== undefined)
        {
            this.resizeFontSize(ctx);
            let font_material = ctx.measureText(this.val);
            let t_h = font_material.actualBoundingBoxAscent + font_material.actualBoundingBoxDescent;
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

    clear()
    {
        this.elements = [];
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
        ctx.beginPath();
        ctx.moveTo(ele1.x, ele1.y);
        ctx.lineTo(ele2.x, ele2.y);
        ctx.stroke();
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

    splitCanvas(canvas)
    {
        let maxElementNum = this.getMaxElementNum_binary();
        let depth = this.parser.levels.length - 1; //去尾
        let unitWidth = parseInt(canvas.width / maxElementNum);
        let unitHeight = parseInt(canvas.height / depth);
        return {"unitWidth": unitWidth, "unitHeight": unitHeight,
                "maxElementNum": maxElementNum, "depth": depth};
    }

    drawSplitCanvas(canvas)
    {
        let specification = this.splitCanvas(canvas);
        let mid = parseInt(canvas.height / 2);
        for (let i = 0; i < specification["maxElementNum"]; i++)
        {
            this.elements.push(new Circle(specification["unitWidth"] * i + parseInt(specification["unitWidth"] / 2), mid, parseInt(specification["unitWidth"] / 2), "100"));
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
            algorithmVisualizationSystem.clear();
            algorithmVisualizationSystem.setType($("#s_type").text());
            algorithmVisualizationSystem.parser.parse($("#i_data").val());
            algorithmVisualizationSystem.parser.getLevels();
            algorithmVisualizationSystem.drawSplitCanvas(canvas);
            algorithmVisualizationSystem.drawAllElement(ctx);
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