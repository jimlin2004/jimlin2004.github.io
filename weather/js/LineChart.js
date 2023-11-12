import { Chart } from "./Chart.js";

class LineChart extends Chart
{
    constructor(width, height)
    {
        super(width, height);
    }

    draw()
    {
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - this.margin.bottom - this.margin.top})`)
            .call(d3.axisBottom(this.xScale));

        this.svg.append("g")
            // .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        this.svg.append("path")
            .datum(this.data)
            .attr("d", d3.line()
                .x((d) => {return this.xScale(d[0]);})
                .y((d) => {return this.yScale(d[1]);})
            )
            .attr("fill", "none")
            .attr("stroke", "yellow")
            .attr("stroke-width", 3);
    }
};

export {LineChart};