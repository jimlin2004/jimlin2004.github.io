import { Chart } from "./Chart.js";

class LineChart extends Chart
{
    constructor(width, height)
    {
        super(width, height);
    }

    /**
     * 
     * @param selector: string
     * @description: 
     *      設定svg的容器html element，並create svg
     */
    setContainer(selector)
    {
        this._createSvg(selector);

        this.svg.append("rect")
            .attr("class", "hintRect")
            .attr("width", 0)
            .attr("height", this.height)
            .attr("fill-opacity", "0.1")
            .style("user-select", "none")
            .style("pointer-events", "none");

        this.svg.append("rect")
            .attr("class", "mouseListeningRect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill-opacity", "0")
            .style("z-index", 1)
            .style("pointer-events", "all")
            .on("mousemove", (e) => {
                const mouseX = d3.pointer(e)[0];
                const mouseY = d3.pointer(e)[1];

                // const target = this.xScale.invert(mouseX);
                //scaleBand()沒有invert
                let bandIndex = Math.floor((mouseX) / (this.xScale.bandwidth()));
                
                if (bandIndex > 13)
                    bandIndex = 13;
                if (bandIndex < 0)
                    bandIndex = 0;

                this.svg.select(".hintRect")
                    .attr("width", this.xScale.bandwidth())
                    .attr("x", this.xScale.bandwidth() * bandIndex);
                
                let tooltip = d3.select(".lineChartTooltip");
                let toolTipWidth = tooltip.node().getBoundingClientRect().width;
                let tooltipXOffset = 0;
                if (e.pageX > (d3.select("body").node().getBoundingClientRect().width / 2))
                {
                    tooltipXOffset = -toolTipWidth;
                }

                tooltip.style("visibility", "visible")
                    .style("top", `${e.pageY + 20}px`)
                    .style("left", `${e.pageX + tooltipXOffset}px`);
                tooltip.select(".tooltipMinTText").node().textContent = `${this.datas[0][bandIndex].yData}°C`;
                tooltip.select(".tooltipMaxTText").node().textContent = `${this.datas[1][bandIndex].yData}°C`;
            })
            .on("mouseout", (e) => {
                d3.select(".lineChartTooltip")
                    .style("visibility", "hidden")
                    .style("top", `0`)
                    .style("left", `0`);

                this.svg.select(".hintRect")
                    .attr("width", 0);
            });
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
        let maxY = d3.max(this.datas[1], (d) => {return +d.yData;});
        let minY = d3.min(this.datas[0], (d) => {return +d.yData;});

        //讓資料中沒有負的還是從0開始
        minY = Math.min(0, minY);

        //讓y axis大一點，讓資料數字不要重疊到x axis
        if (minY - 0 < 5 && minY != 0)
            minY -= 5;

        this.yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([this.height, 0])
            .nice();
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
                        //以下為endTIme
                        //到06:00的是晚上，到18:00的是早上
                        if (d.getHours() === 6)
                        {
                            let newD = new Date();
                            newD.setDate(d.getDate() - 1);
                            return d3.timeFormat("晚上<br/>%m/%d")(newD);
                        }
                        else if (d.getHours() === 18)
                            return d3.timeFormat("早上<br/>%m/%d")(d);
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

        this.svg.selectAll("g.x-axis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0).attr("y1", -this.height)
            .attr("x2", 0).attr("y2", 0)

        this.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(this.yScale));

        this.svg.selectAll("g.y-axis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", this.width).attr("y2", 0)

        let legend = this.svg.append("g")
            .attr("class", "legend");

        let legendLineWidth = 20;
        let legendLineHeight = 3;

        let minTText = legend.append("text")
            .attr("class", "minTText")
            .attr("x", legendLineWidth)
            .text("最低溫度");

        let textMetrics = Chart.getTextMetrics("最低溫度", minTText.style("font"));
        let textHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

        legend.append("rect")
            .attr("width", legendLineWidth)
            .attr("height", legendLineHeight)
            .attr("x", 0)
            .attr("y", -textHeight / 2 + legendLineHeight)
            .attr("fill", this.dataColors[0]);
        
        legend.append("rect")
            .attr("width", legendLineWidth)
            .attr("height", legendLineHeight)
            .attr("x", legendLineWidth + textMetrics.width)
            .attr("y", -textHeight / 2 + legendLineHeight)
            .attr("fill", this.dataColors[1])

        legend.append("text")
            .attr("class", "maxTText")
            .attr("x", 2 * legendLineWidth + textMetrics.width)
            .text("最高溫度");

        let legendWidth = 2 * (legendLineWidth + textMetrics.width);

        legend.attr("transform", `translate(${this.width / 2 - legendWidth / 2}, ${this.height + this.margin.top + 20})`)
        
        this.svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -this.height / 2)
            .attr("y", -this.margin.left + 20)
            .attr("text-anchor", "midden")
            .attr("transform", "rotate(-90)")
            .text("溫度(°C)");
    }

    draw()
    {
        this.drawAxis();

        const dataNames = ["minT","maxT"];
        const circleTextOffset = [6, -6];
        const circleTextAlignment = ["hanging", "baseline"];

        for (let i = 0; i < this.datas.length; ++i)
        {
            this.svg.append("path")
                .datum(this.datas[i])
                .attr("d", d3.line()
                    .x((d) => {return this.xScale(d.xData) + this.xScale.bandwidth() / 2;})
                    .y((d) => {return this.yScale(d.yData)})
                )
                .attr("fill", "none")
                .attr("stroke", this.dataColors[i])
                .attr("stroke-width", 3);

            let circle_g = this.svg
                .selectAll("dot")
                .data(this.datas[i])
                .enter()
                .append("g")

            circle_g.append("circle")
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
            
            circle_g.append("text")
                .attr("x", (d) => {
                    return this.xScale(d.xData) + this.xScale.bandwidth() / 2;
                })
                .attr("y", (d) => {
                    return this.yScale(d.yData) + circleTextOffset[i];
                })
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", circleTextAlignment[i])
                .text((d) => {
                    return `${d.yData}`;
                });
        }
    }
};

export {LineChart};