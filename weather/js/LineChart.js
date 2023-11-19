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
            .call(d3.axisBottom(this.xScale)
                    .tickFormat((d) => {
                        if (d.getHours() === 6)
                            return d3.timeFormat("早上<br/>%m/%d")(d);
                        else if (d.getHours() === 18)
                            return d3.timeFormat("晚上<br/>%m/%d")(d);
                        else
                            throw new Error("unknow time");
            }))
            .selectAll(".tick text")
            .each((d, i, nodes) => {
                //換行，用<br/>隔開
                let text = d3.select(nodes[i]);
                let words = text.text().split("<br/>");
                text.text("");

                for (let i = 0; i < words.length; ++i)
                {
                    let tspan = text.append("tspan").text(words[i]);
                    if (i > 0)
                        tspan.attr("x", 0).attr("dy", 15);
                }
            })

        this.svg.append("g")
            // .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        this.svg.append("path")
            .datum(this.data)
            .attr("d", d3.line()
                .x((d) => {return this.xScale(d.xData);})
                .y((d) => {return this.yScale(d.yData);})
            )
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 3);
    }
};

export {LineChart};