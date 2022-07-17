import {BinarySearchTree} from "./BinarySearchTree.js"

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
    }
    
    connect(ctx, ele1, ele2)
    {
        ctx.beginPath();
        ctx.moveTo(ele1.x, ele1.y);
        ctx.lineTo(ele2.x, ele2.y);
        ctx.stroke();
    }
};

$(function() {
    let fontface = new FontFace("Silver", "url(../../font/Silver.ttf)");
    const canvas = document.getElementById("main_canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = $("#content").width() - $("#side_menu").width() - 5;
    canvas.height = $("#content").height() * 0.6;
    let algorithmVisualizationSystem = new AlgorithmVisualizationSystem("");
    fontface.load().then((font) => {
        document.fonts.add(font);
        // ctx.font = `${canvas.width * 0.08}px Silver`;
        let circle1 = new Circle(100, 100, 30, "1234");
        let circle2 = new Circle(200, 200, 30, "嗨");
        algorithmVisualizationSystem.connect(ctx, circle1, circle2);
        circle1.draw(ctx);
        circle2.draw(ctx);
    });
});