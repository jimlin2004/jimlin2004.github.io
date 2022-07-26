class RenderSystem
{
    constructor()
    {

    }

    static line(ctx, x1, y1, x2, y2, lineWidth = 3, color = "#000000")
    {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

export {RenderSystem};