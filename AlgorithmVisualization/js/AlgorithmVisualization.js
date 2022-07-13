import {BinarySearchTree} from "BinarySearchTree.js"

class Circle
{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw(ctx, text)
    {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        if (text !== undefined)
            ctx.fillText(text, this.x - (ctx.measureText(text).width / 2), this.y);
    }
};

$(function() {
    let fontface = new FontFace("Silver", "url(../../font/Silver.ttf)");
    const canvas = document.getElementById("main_canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = $("#content").width() - $("#side_menu").width() - 5;
    canvas.height = $("#content").height() * 0.6;
    fontface.load().then((font) => {
        document.fonts.add(font);
        ctx.font = `${canvas.width * 0.05}px Silver`;
        let circle = new Circle(100, 100, 50);
        circle.draw(ctx, "2");
    });
});