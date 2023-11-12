class Dataset
{
    constructor(xData, yData)
    {
        this.xData = xData;
        this.yData = yData;
    }

    getXData()
    {
        return this.xData;
    }

    getYData()
    {
        return this.yData;
    }

    setXData(xData)
    {
        this.xData = xData;
    }

    setYData(yData)
    {
        this.yData = yData;
    }
};

class Chart
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.svg = null;
        this.data = null;
        this.xScale = null;
        this.yScale = null;
        this.margin = {
            top: 30,
            right: 30, 
            bottom: 30, 
            left: 30
        };
    }

    /**
     * 
     * @param w: int
     * @description: 設定width 
     */
    setWidth(w)
    {
        this.width = w;
    }

    /**
     * 
     * @param h: int
     * @description: 設定height 
     */
    setHeight(h)
    {
        this.height = h;
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
    }

    /**
     * 
     * @param selector: string
     * @description: create svg 
     */
    _createSvg(selector)
    {
        this.svg = d3.select(selector)
                    .append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)
                    .append("g")
                    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    /**
     * 
     * @param data: Dataset
     */
    setData(data)
    {
        this.data = data;
        this.setXScale();
        this.setYScale();
    }

    setXScale()
    {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, (d) => d[0])])
            .range([0, this.width - this.margin.left - this.margin.right]);
    }

    setYScale()
    {
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, (d) => d[1])])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
    }
};

export {Dataset, Chart};