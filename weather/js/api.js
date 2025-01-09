import { InfoCard } from "./InfoCard.js";
import { Dataset } from "./Chart.js";
import { LineChart } from "./LineChart.js";
import { Converter } from "./Converter.js";
import { MapParser } from "./MapParser.js";

class Weather
{
    constructor(_wxData, _popData, _minTData, _maxTData, _minATData, _maxATData)
    {
        this.wxData = _wxData;
        this.popData = _popData;
        this.minTData = _minTData;
        this.maxTData = _maxTData;
        this.minATData = _minATData;
        this.maxATData = _maxATData;
    }
};

class WeatherSystem
{
    constructor()
    {
        this.weather36hrMap = null;
        this.weatherOneWeekMap = null;
    }

    static selectedLocation = null;
    static weatherData36hr = null;

    static setSelectedLocation(location)
    {
        if (WeatherSystem.selectedLocation != null)
        {
            $(WeatherSystem.selectedLocation).removeClass("selectedLocation");
        }
        WeatherSystem.selectedLocation = location;
        $(WeatherSystem.selectedLocation).addClass("selectedLocation");
    }

    static getSelectedLocation()
    {
        return WeatherSystem.selectedLocation;
    }

    static getSelectedLocationName()
    {
        return WeatherSystem.selectedLocation.getAttribute("name");
    }
    
    get36hrRecords()
    {
        if (WeatherSystem.weatherData36hr === null)
        {
            throw new Error("氣象資料為空");
        }
        this.weather36hrMap = new Map();
        for (let weather of WeatherSystem.weatherData36hr["records"]["location"])
        {
            this.weather36hrMap.set(weather["locationName"], new Weather(weather["weatherElement"][0], weather["weatherElement"][1], 
                weather["weatherElement"][2], weather["weatherElement"][4], null, null));
        }

        console.log(this.weather36hrMap);
    }

    get36hrRecord(location)
    {
        return this.weather36hrMap.get(location);
    }

    static ajax(args)
    {
        return new Promise((resolve, reject) => {
            $.ajax(args)
                .done(resolve)
                .fail(reject);
        });
    }

    async getOneWeekRecords()
    {
        return new Promise((resolve, reject) => {
            WeatherSystem.ajax({
                url: "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWA-EA6E5A12-B52C-4D2A-A0C9-A91BC237056C&format=JSON&elementName=MinT,MaxT,PoP12h,Wx,MinAT,MaxAT",
                // url: "../weather/assets/F-D0047-091.json",
                method: "GET",
                dataType: "json",
            })
            .then((res) => {
                if (res === null)
                {
                    throw new Error("氣象資料為空");
                }
                
                this.weatherOneWeekMap = new Map();
                for (let weather of res["records"]["Locations"][0]["Location"])
                {
                    this.weatherOneWeekMap.set(weather["LocationName"], new Weather(weather["WeatherElement"][12], weather["WeatherElement"][1], 
                        weather["WeatherElement"][2], weather["WeatherElement"][1], weather["WeatherElement"][6], weather["WeatherElement"][5]));
                }
                console.log(this.weatherOneWeekMap);
            })
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            })
        });
    }

    getOneWeekRecord(location)
    {
        return this.weatherOneWeekMap.get(location);
    }

    setupTooltips()
    {
        for (let location of $(".Taiwan path"))
        {
            location.setAttribute("data-tooltip", location.getAttribute("name"));
        }
    }

    //用startTime會有問題(太多種)
    static get36hrTimeDescription(endTime)
    {
        if (endTime === "06:00:00")
        {
            return ["今夜明晨", "明日白天", "明日晚上"];
        }
        else if (endTime == "18:00:00")
        {
            return ["今日白天", "今夜明晨", "明日白天"];
        }

        throw new Error("unknow endTime");
    }

    createOneWeekForecastTable()
    {
        const dayNames = [
            "星期日", "星期一", "星期二",
            "星期三", "星期四", "星期五", "星期六"
        ];

        let data = this.getOneWeekRecord(locationTranslate[WeatherSystem.getSelectedLocationName()]);
        let startIndex = 0;
        if (data.maxTData.Time.length == 15)
            startIndex = 1;
        else if (data.maxTData.Time.length == 14)
            startIndex = 0;
        else
            throw new Error("unkown weather data size");

        document.querySelector("#oneWeekForecastTable .location-th").textContent = locationTranslate[WeatherSystem.getSelectedLocationName()];

        let table = document.querySelector("#oneWeekForecastTable .tbody");
        
        while (table.firstChild)
        {
            table.removeChild(table.firstChild);
        }

        let itemCount = 1;
        let isOddItem = true;

        let isFirst = true;

        for (let i = 0; i < 14; i += 2)
        {
            let index = startIndex + i;
            let oneDayTr = document.createElement("div");
            oneDayTr.classList.add("row-tr");
            if (isFirst)
            {
                oneDayTr.classList.add("show");
            }
            else
            {
                oneDayTr.classList.add("hide");
            }
            
            oneDayTr.classList.add((isOddItem) ? "odd-item" : "even-item");
            isOddItem = !isOddItem;
            oneDayTr.setAttribute("data-item-number", `${itemCount++}`);

            let time_format = data.maxTData.Time[index].StartTime.split("T");
            let timeyymmdd = time_format[0].split("-");

            let oneDayHeader = document.createElement("div");
            oneDayHeader.classList.add("table-item-header");
            if (isFirst)
            {
                oneDayHeader.classList.add("show");
                isFirst = false;
            }
            else
            {
                oneDayHeader.classList.add("hide");
            }
            oneDayHeader.innerHTML = `
                <p>${timeyymmdd[1]}/${timeyymmdd[2]}</p>
                <p>${dayNames[new Date(time_format[0].split("T")[0]).getDay()]}</p>
            `;

            let oneDayData = `
                <div class = "cell-th">
                    <p>${timeyymmdd[1]}/${timeyymmdd[2]}</p>
                    <p>${dayNames[new Date(time_format[0].split("T")[0]).getDay()]}</p>
                </div>

                <div class = "tr-title">
                    <p>溫度</p>
                </div>
                <div class = "cell-td">
                    <div>
                        <p>早上</p>
                        <img class = "weatherIcon" src = "./assets/svg/weatherDescription/${Converter.getWeatherIcon(data.wxData.Time[index].ElementValue[0].Weather)[0]}">
                        <p>${data.minTData.Time[index].ElementValue[0].MinTemperature} ~ ${data.maxTData.Time[index].ElementValue[0].MaxTemperature} °C</p>
                    </div>
                </div> 
                <div class = "cell-td">
                    <div>
                        <p>晚上</p>
                        <img class = "weatherIcon" src = "./assets/svg/weatherDescription/${Converter.getWeatherIcon(data.wxData.Time[index].ElementValue[0].Weather)[1]}">
                        <p>${data.minTData.Time[index + 1].ElementValue[0].MinTemperature} ~ ${data.maxTData.Time[index + 1].ElementValue[0].MaxTemperature} °C</p>
                    </div>
                </div>
            
                <div class = "tr-title">
                    <p>體感溫度</p>
                </div>
                <div class = "cell-td">
                    <p>${data.minATData.Time[index].ElementValue[0].MinApparentTemperature} ~ ${data.maxATData.Time[index].ElementValue[0].MaxApparentTemperature} °C</p>
                </div>
                <div class = "cell-td">
                    <p>${data.minATData.Time[index + 1].ElementValue[0].MinApparentTemperature} ~ ${data.maxATData.Time[index + 1].ElementValue[0].MaxApparentTemperature} °C</p>
                </div>

                <div class = "tr-title">
                    <p>天氣描述</p>
                </div>
                <div class = "cell-td">
                    ${data.wxData.Time[index].ElementValue[0].Weather}
                </div>
                <div class = "cell-td">
                    ${data.wxData.Time[index + 1].ElementValue[0].Weather}
                </div>
            `;

            oneDayTr.innerHTML = oneDayData;

            oneDayHeader.addEventListener("click", (e) => {
                if (oneDayTr.classList.contains("show"))
                {
                    oneDayTr.classList.remove("show");
                    oneDayTr.classList.add("hide");
                    e.target.closest(".table-item-header").classList.remove("show");
                    e.target.closest(".table-item-header").classList.add("hide");
                }
                else
                {
                    oneDayTr.classList.remove("hide");
                    oneDayTr.classList.add("show");
                    e.target.closest(".table-item-header").classList.remove("hide");
                    e.target.closest(".table-item-header").classList.add("show");
                }
            });

            table.appendChild(oneDayHeader);
            table.appendChild(oneDayTr);
        }
    }
};

class TabWidget 
{
    constructor()
    {
        this.htmlElement = document.querySelector(".tab-widget");
        this.registerEvents();
    }

    registerEvents()
    {
        $(".tab-widget button").on("click", (e) => {
            let activedContent = this.htmlElement.querySelector(".tab-widget-content-div.active");
            activedContent.classList.remove("active");
            activedContent.classList.add("inactive");
            let activedButton = this.htmlElement.querySelector(".tab-buttons button.active");
            activedButton.classList.remove("active");
            let targetContent = document.querySelector(`${e.target.dataset.content}`);
            targetContent.classList.remove("inactive");
            targetContent.classList.add("active");
            //clicked button
            e.target.classList.add("active");
        });
    }
};

class User
{
    constructor()
    {
        this.location = null;
        this.userArgeed = true;
    }

    async init()
    {
        await this.getUserLocation();
    }

    async getUserLocation()
    {
        if (navigator.geolocation)
        {
            this.location = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
            .catch((reason) => {
                //使用者不同意
                this.userArgeed = false;
            })
            ;
        }
        else
        {
            //使用者不同意
            this.userArgeed = false;
        }

        if (!this.userArgeed)
        {
            alert("若使用者不同意提供定位資訊，此工具將預設提供臺北天氣資訊，請使用者自行選擇所在地區，感謝");
        }
    }
};

$.ajax({
    url: "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-EA6E5A12-B52C-4D2A-A0C9-A91BC237056C&format=JSON",
    // url: "../weather/assets/F-C0032-001.json",
    method: "GET",
    dataType: "json",
    success: (res) => {
        WeatherSystem.weatherData36hr = res;
        main();
    }
});

let locationTranslate = {
    "高雄市": "Kaohsiung City",
    "屏東縣": "Pingtung",
    "臺南市": "Tainan City",
    "新竹市": "Hsinchu City",
    "新竹縣": "Hsinchu",
    "宜蘭縣": "Yilan",
    "基隆市": "Keelung City",
    "苗栗縣": "Miaoli",
    "臺北市": "Taipei City",
    "新北市": "New Taipei City",
    "桃園市": "Taoyuan",
    "彰化縣": "Changhua",
    "嘉義縣": "Chiayi",
    "嘉義市": "Chiayi City",
    "花蓮縣": "Hualien",
    "南投縣": "Nantou",
    "臺中市": "Taichung City",
    "雲林縣": "Yunlin",
    "臺東縣": "Taitung",
    "澎湖縣": "Penghu",
    "金門縣": "Kinmen",
    "連江縣": "Lienchiang",
    
    "Kaohsiung City": "高雄市",
    "Pingtung": "屏東縣",
    "Tainan City": "臺南市",
    "Hsinchu City": "新竹市",
    "Hsinchu": "新竹縣",
    "Yilan": "宜蘭縣",
    "Keelung City": "基隆市",
    "Miaoli": "苗栗縣",
    "Taipei City": "臺北市",
    "New Taipei City": "新北市",
    "Taoyuan": "桃園市",
    "Changhua": "彰化縣",
    "Chiayi": "嘉義縣",
    "Chiayi City": "嘉義市",
    "Hualien": "花蓮縣",
    "Nantou": "南投縣",
    "Taichung City": "臺中市",
    "Yunlin": "雲林縣",
    "Taitung": "臺東縣",
    "Penghu": "澎湖縣",
    "Kinmen": "金門縣",
    "Lienchiang": "連江縣"
};

function tooltipFactory(node, mouseX, mouseY, weatherData)
{
    let tooltipDiv = document.createElement("div");
        tooltipDiv.innerHTML = `
            <p>${locationTranslate[node.dataset.tooltip]}</p>
            <p>溫度: ${weatherData.minTData.time[1].parameter.parameterName} ~ ${weatherData.maxTData.time[1].parameter.parameterName}°C</p>
            <p>${weatherData.wxData.time[1].parameter.parameterName}</p>
            <p>降雨機率: ${weatherData.popData.time[1].parameter.parameterName}%</p>
            <p>6:00 ~ 18:00</p>
        `;
        tooltipDiv.id = "tooltip";
        tooltipDiv.style = `
            background-color: #ffffffc0;
            border: 2px solid #000;
            border-radius: 5px;
            box-shadow: 0 0 3px;
            padding: 2px;
        `;

        tooltipDiv.style.position = "absolute";
        tooltipDiv.style.top = `${mouseY}px`;
        tooltipDiv.style.left = `${mouseX}px`;
        tooltipDiv.style.userSelect = "none";
        tooltipDiv.style.pointerEvents = "none";
    $("body").append(tooltipDiv);
}

async function main()
{
    let weatherSystem = new WeatherSystem();
    weatherSystem.setupTooltips();

    weatherSystem.get36hrRecords();
    
    await weatherSystem.getOneWeekRecords();
    
    let mapParser = new MapParser();
    await mapParser.parseTopoJson();

    let user = new User();
    await user.init();

    let tabWidgetContent = document.querySelector(".tab-widget .tab-widget-contents");
    
    let tabWidget = new TabWidget();

    let chartWidth = Math.max(tabWidgetContent.getBoundingClientRect().width, 640);

    let tLineChart = new LineChart(chartWidth, 400);
    let atLineChart = new LineChart(chartWidth, 400);

    window.addEventListener("resize", (e) => {
        d3.selectAll(".tab-widget svg").remove();

        let chartWidth = Math.max(tabWidgetContent.getBoundingClientRect().width, 640);
        
        tLineChart.setWidth(chartWidth);
        tLineChart.setHeight(400);
        tLineChart.setContainer(".tab-widget #temperature-chart .chartWrap");
        tLineChart.draw();

        atLineChart.setWidth(chartWidth);
        atLineChart.setHeight(400);
        atLineChart.setContainer(".tab-widget #apparent-temperature-chart .chartWrap");
        atLineChart.draw();
    });
    
    $(".Taiwan path").on("mouseenter", (e) => {
        tooltipFactory(e.target, e.pageX, e.pageY, weatherSystem.get36hrRecord(locationTranslate[e.target.dataset.tooltip]));
    });

    $(".Taiwan path").on("mouseleave", (e) => {
        $("#tooltip").remove();
    });

    $(".Taiwan path").on("click", (e) => {
        WeatherSystem.setSelectedLocation(e.target);

        let weatherData = weatherSystem.get36hrRecord(locationTranslate[WeatherSystem.getSelectedLocationName()]);
        
        let endTime = weatherData.minTData.time[0].endTime.split(" ")[1];

        let timeDescriptions = WeatherSystem.get36hrTimeDescription(endTime);
        let isNight = 0;
        if (endTime == "06:00:00")
            isNight = 1;
        else
            isNight = 0;
        
        let infoCards = document.querySelectorAll(".info-card");

        document.getElementById("city-select").value = locationTranslate[WeatherSystem.getSelectedLocationName()];

        for (let i = 0; i < 3; ++i)
        {
            InfoCard.updateInfoCard(
                infoCards[i], 
                timeDescriptions[i],
                weatherData.wxData.time[i].parameter.parameterName,
                weatherData.minTData.time[i].parameter.parameterName,
                weatherData.maxTData.time[i].parameter.parameterName,
                weatherData.popData.time[i].parameter.parameterName,
                isNight
            );
            isNight ^= 1; //切換白天或晚上的icon
        }
        
        weatherSystem.createOneWeekForecastTable();
        
        let weatherDatas = weatherSystem.getOneWeekRecord(locationTranslate[WeatherSystem.getSelectedLocationName()]);
        let tLineChartData = {minT: [], maxT: []};
        let atLineChartData = {minT: [], maxT: []};
        let startIndex = 0;
        if (weatherDatas.maxTData.Time.length == 15)
            startIndex = 1;
        else if (weatherDatas.maxTData.Time.length == 14)
            startIndex = 0;
        else
            throw new Error("unkown weather data size");
        for (let i = 0; i < 14; ++i)
        {
            let index = startIndex + i;
            //以下用endTime判斷，startTime太多種
            tLineChartData.minT.push(new Dataset(new Date(weatherDatas.minTData.Time[index].EndTime), weatherDatas.minTData.Time[index].ElementValue[0].MinTemperature));
            tLineChartData.maxT.push(new Dataset(new Date(weatherDatas.maxTData.Time[index].EndTime), weatherDatas.maxTData.Time[index].ElementValue[0].MaxTemperature))
            atLineChartData.minT.push(new Dataset(new Date(weatherDatas.minATData.Time[index].EndTime), weatherDatas.minATData.Time[index].ElementValue[0].MinApparentTemperature));
            atLineChartData.maxT.push(new Dataset(new Date(weatherDatas.maxATData.Time[index].EndTime), weatherDatas.maxATData.Time[index].ElementValue[0].MaxApparentTemperature))
        }

        d3.selectAll(".tab-widget svg").remove();
        
        tLineChart.clearData();
        tLineChart.clearDataColor();
        tLineChart.setContainer(".tab-widget #temperature-chart .chartWrap");
        tLineChart.addData(tLineChartData.minT);
        tLineChart.addDataColor("#1f77b4");
        tLineChart.addData(tLineChartData.maxT);
        tLineChart.addDataColor("#ff7f0e");
        tLineChart.draw();

        atLineChart.clearData();
        atLineChart.clearDataColor();
        atLineChart.setContainer(".tab-widget #apparent-temperature-chart .chartWrap");
        atLineChart.addData(atLineChartData.minT);
        atLineChart.addDataColor("#1f77b4");
        atLineChart.addData(atLineChartData.maxT);
        atLineChart.addDataColor("#ff7f0e");
        atLineChart.draw();
    });

    document.getElementById("city-select").addEventListener("change", (e) => {
        document.querySelector(`.Taiwan path[name="${locationTranslate[e.target.value]}"]`).dispatchEvent(new Event("click"));
    });

    if (user.userArgeed)
        document.querySelector(`.Taiwan path[name="${locationTranslate[mapParser.getCityName(user.location)]}"]`).dispatchEvent(new Event("click"));
    else
        document.querySelector(`.Taiwan path[name="Taipei City"]`).dispatchEvent(new Event("click"));

    //讓網頁觸發一次resize事件，否則如果第一次載入時已是直式排版svg width 會出錯
    window.dispatchEvent(new Event("resize"));
}