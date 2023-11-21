import { Chart } from "./Chart.js";

class LineChart extends Chart
{
    constructor(width, height)
    {
        super(width, height);
    }

    setXScale()
    {
        this.xScale = d3.scaleBand()
            .domain(this.datas[0].map((d) => {
                return d.xData;
            }))
            .range([0, this.width]);
    }

    setYScale()
    {
        let maxY = d3.max(this.datas[0], (d) => {return +d.yData;});
        for (let i = 1; i < this.datas.length; ++i)
        {
            maxY = d3.max(this.datas[i], (d) => {return +d.yData;});
        }

        this.yScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([this.height, 0]);
    }

    drawAxis()
    {
        this.setXScale();
        this.setYScale();

        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.height})`)
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

        d3.selectAll("g.x-axis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0).attr("y1", -this.height)
            .attr("x2", 0).attr("y2", 0)

        this.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(this.yScale));

        d3.selectAll("g.y-axis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", this.width).attr("y2", 0)
    }

    draw()
    {
        this.drawAxis();

        let dataNames = ["minT","maxT"];

        for (let i = 0; i < this.datas.length; ++i)
        {
            this.svg.append("path")
                .datum(this.datas[i])
                .attr("d", d3.line()
                    .x((d) => {return this.xScale(d.xData) + this.xScale.bandwidth() / 2;})
                    .y((d) => {return this.yScale(d.yData);})
                )
                .attr("fill", "none")
                .attr("stroke", this.dataColors[i])
                .attr("stroke-width", 3);

            this.svg.append("g")
                .selectAll("dot")
                .data(this.datas[i])
                .enter()
                .append("circle")
                    .attr("cx", (d) => {
                        return this.xScale(d.xData) + this.xScale.bandwidth() / 2;
                    })
                    .attr("cy", (d) => {
                        return this.yScale(d.yData);
                    })
                    .attr("r", 3)
                    .attr("fill", "#fff")
                    .attr("stroke", "red")
                    .attr("class", `circle-${dataNames[i]}`);
        }
        this.svg.selectAll("circle.circle-minT")
            .data(this.datas[0])
            .enter()
            .append("text")
                .attr("x", (d) => {
                    return d.xData;
                })
                .attr("y", (d) => {
                    return this.height - d.yData;
                })
                .text((d) => {
                    return `${d.yData}`;
                })
    }
};

export {LineChart};