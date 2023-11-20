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
        this.svg = null;
        this.datas = [];
        this.dataColors = [];
        this.xScale = null;
        this.yScale = null;
        this.margin = {
            top: 30,
            right: 30, 
            bottom: 60, 
            left: 30
        };
        
        this.setWidth(width);
        this.setHeight(height);
    }

    /**
     * 
     * @param w: int
     * @description: 設定width 
     */
    setWidth(w)
    {
        this.width = w - this.margin.left - this.margin.right;
    }

    /**
     * 
     * @param h: int
     * @description: 設定height 
     */
    setHeight(h)
    {
        this.height = h - this.margin.top - this.margin.bottom;
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
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    /**
     * 
     * @param data: Dataset
     */
    addData(data)
    {
        this.datas.push(data);
    }

    clearData()
    {
        this.datas.length = 0; //clear
    }

    /**
     * 
     * @param color: string 
     */
    addDataColor(color)
    {
        this.dataColors.push(color);
    }

    clearDataColor()
    {
        this.dataColors.length = 0; //clear
    }

    setXScale()
    {
        throw new Error("You should implement this method");
    }

    setYScale()
    {
        throw new Error("You should implement this method");
    }
};

export {Dataset, Chart};