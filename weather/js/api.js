import { InfoCard } from "./InfoCard.js";
import { Dataset } from "./Chart.js";
import { LineChart } from "./LineChart.js";
import { Converter } from "./Converter.js";

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
                // url: https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWA-EA6E5A12-B52C-4D2A-A0C9-A91BC237056C&format=JSON&elementName=MinT,MaxT,PoP12h,Wx,MinAT,MaxAT
                url: "../weather/assets/F-D0047-091.json",
                method: "GET",
                dataType: "json",
            })
            .then((res) => {
                if (res === null)
                {
                    throw new Error("氣象資料為空");
                }
                
                this.weatherOneWeekMap = new Map();
                for (let weather of res["records"]["locations"][0]["location"])
                {
                    this.weatherOneWeekMap.set(weather["locationName"], new Weather(weather["weatherElement"][2], weather["weatherElement"][0], 
                        weather["weatherElement"][3], weather["weatherElement"][5], weather["weatherElement"][4], weather["weatherElement"][1]));
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

    static get36hrTimeDescription(startTime)
    {
        if (startTime === "06:00:00")
        {
            return ["今日白天", "今夜明晨", "明日白天"];
        }
        else if (startTime == "18:00:00")
        {
            return ["今夜明晨", "明日白天", "明日晚上"];
        }

        throw new Error("unknow startTime");
    }

    createOneWeekForecastTable()
    {
        const dayNames = [
            "星期日", "星期一", "星期二",
            "星期三", "星期四", "星期五", "星期六"
        ];

        let data = this.getOneWeekRecord(locationTranslate[WeatherSystem.getSelectedLocationName()]);
        let tableData = "";
        let table_time_header = document.querySelector("#oneWeekForecastTable .table-time-header");
        let table_time_data = "";
        let table_daytime_t_data = "";
        let table_night_t_data = "";

        if (data.maxTData.time.length == 15)
        {
            table_time_data += `
                <th>${locationTranslate[WeatherSystem.getSelectedLocationName()]}</th>
            `;
            for (let i = 1; i <= 14; i += 2)
            {
                let time_format = data.maxTData.time[i].startTime.split(" ")[0];
                let timeyymmdd = time_format.split("-");
                table_time_data += `
                    <th>
                        <p>${timeyymmdd[1]}/${timeyymmdd[2]}</p>
                        <p>${dayNames[new Date(time_format.split(" ")[0]).getDay()]}</p>
                    </th>
                `;
            }

            let table_time_dayTime = document.querySelector("#oneWeekForecastTable .table-time-dayTime")
            let table_time_dayTime_data = "<th>早上</th>";

            let table_time_night = document.querySelector("#oneWeekForecastTable .table-time-night");
            let table_time_night_data = "<th>晚上</th>";
            
            //體感溫度
            let table_AT_dayTime = document.querySelector("#oneWeekForecastTable .table-AT-dayTime")
            let table_AT_dayTime_data = "<th><p>體感溫度</p><p>(早)</p></th>";

            let table_AT_night = document.querySelector("#oneWeekForecastTable .table-AT-night");
            let table_AT_night_data = "<th><p>體感溫度</p><p>(晚)</p></th>";
            
            for (let i = 1; i <= 14; ++i)
            {
                if (i % 2)
                {
                    table_time_dayTime_data += `
                        <td>
                            <img class = "weatherIcon" src = "./assets/svg/weatherDescription/${Converter.getWeatherIcon(data.wxData.time[i].elementValue[0].value)[0]}">
                            <p>${data.minTData.time[i].elementValue[0].value} ~ ${data.maxTData.time[i].elementValue[0].value} °C</p>
                        </td>`;
                    
                    table_AT_dayTime_data += `
                        <td>
                            <p>${data.minATData.time[i].elementValue[0].value} ~ ${data.maxATData.time[i].elementValue[0].value} °C</p>
                        </td>`;
                }
                else
                {
                    table_time_night_data += `
                        <td>
                            <img class = "weatherIcon" src = "./assets/svg/weatherDescription/${Converter.getWeatherIcon(data.wxData.time[i].elementValue[0].value)[1]}">
                            <p>${data.minTData.time[i].elementValue[0].value} ~ ${data.maxTData.time[i].elementValue[0].value} °C</p>
                        </td>`;

                    table_AT_night_data += `
                    <td>
                        <p>${data.minATData.time[i].elementValue[0].value} ~ ${data.maxATData.time[i].elementValue[0].value} °C</p>
                    </td>`;
                }
            }

            table_time_dayTime.innerHTML = table_time_dayTime_data;
            table_time_night.innerHTML = table_time_night_data;

            table_AT_dayTime.innerHTML = table_AT_dayTime_data;
            table_AT_night.innerHTML = table_AT_night_data;
        }

        table_time_header.innerHTML = table_time_data;
    }
};

class User
{
    constructor()
    {
        this.location = null;
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
            });
        }
        return this.location;
    }
};

$.ajax({
    // url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-EA6E5A12-B52C-4D2A-A0C9-A91BC237056C&format=JSON",
    url: "../weather/assets/F-C0032-001.json",
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
            background-color: #ffffff;
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
    // let user = new User();
    // await user.init();
    weatherSystem.setupTooltips();
    // console.log(user.location);
    weatherSystem.get36hrRecords();
    
    await weatherSystem.getOneWeekRecords();

    $(".Taiwan path").on("mouseenter", (e) => {
        tooltipFactory(e.target, e.clientX, e.clientY, weatherSystem.get36hrRecord(locationTranslate[e.target.dataset.tooltip]));
    });

    $(".Taiwan path").on("mouseleave", (e) => {
        $("#tooltip").remove();
    });

    $(".Taiwan path").on("click", (e) => {
        WeatherSystem.setSelectedLocation(e.target);

        let weatherData = weatherSystem.get36hrRecord(locationTranslate[WeatherSystem.getSelectedLocationName()]);
        
        let startTime = weatherData.minTData.time[0].startTime.split(" ")[1];

        let timeDescriptions = WeatherSystem.get36hrTimeDescription(startTime);
        let isNight = 0;
        if (startTime == "06:00:00")
            isNight = 0;
        else
            isNight = 1;
        
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
    });

    document.getElementById("city-select").addEventListener("change", (e) => {
        document.querySelector(`.Taiwan path[name="${locationTranslate[e.target.value]}"]`).dispatchEvent(new Event("click"));
    });

    document.querySelector(`.Taiwan path[name="New Taipei City"]`).dispatchEvent(new Event("click"));

    let tabWidgetContent = document.querySelector(".tab-widget .tab-widget-contents");

    // console.log(document.querySelector(".tab-widget .tab-widget-contents").offsetWidth);

    // let lineChart = new LineChart(Math.round(tabWidgetContent.getBoundingClientRect().width), Math.round(tabWidgetContent.getBoundingClientRect().width));
    // lineChart.setContainer(".tab-widget .temperature-chart");
    // lineChart.setData([[1, 1], [2, 3], [5, 1], [8, 9]]);
    // lineChart.draw();

    // window.addEventListener("resize", (e) => {
    //     d3.select(".tab-widget svg").remove();
    //     lineChart.setWidth(tabWidgetContent.getBoundingClientRect().width);
    //     lineChart.setHeight(tabWidgetContent.getBoundingClientRect().height);

    //     lineChart.setContainer(".tab-widget .temperature-chart");
    //     lineChart.setData(new Dataset([0, 1, 2, 4, 5], [1, 2, 3, 4, 5]));
    //     lineChart.draw();
    // });
}