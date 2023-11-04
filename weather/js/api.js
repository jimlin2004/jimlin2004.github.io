class Weather
{
    constructor(_wxData, _popData, _minTData, _CIData, _maxTData)
    {
        this.wxData = _wxData;
        this.popData = _popData;
        this.minTData = _minTData;
        this.CIData = _CIData;
        this.maxTData = _maxTData;
    }
};

class WeatherSystem
{
    constructor()
    {
        this.weatherMap = null;
    }

    static selectedLocation = null;

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
    
    getRecords()
    {
        if (weatherData === null)
        {
            throw new Error("氣象資料為空");
        }
        this.weatherMap = new Map();
        for (let weather of weatherData["records"]["location"])
        {
            this.weatherMap.set(weather["locationName"], new Weather(weather["weatherElement"][0], weather["weatherElement"][1], 
                weather["weatherElement"][2], weather["weatherElement"][3], weather["weatherElement"][4]));
        }

        console.log(this.weatherMap);
    }

    setupTooltips()
    {
        for (let location of $(".Taiwan path"))
        {
            location.setAttribute("data-tooltip", location.getAttribute("name"));
        }
    }

    /*
    parameter
        location: 地區名 string
    */
    drawData(location)
    {
        let weatherData = this.weatherMap.get(location);
        
        let div = document.createElement("div");
            let locationNameDiv = document.createElement("div");
            locationNameDiv.innerText = location;
        div.appendChild(locationNameDiv);
    
        $("body").append(div);
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
        weatherData = res;
        main();
    }
});

let locationTranslate = {
    "高雄市": "Kaohsiung City",
    "屏東縣": "Pingtung",
    "台南市": "Tainan City",
    "新竹市": "Hsinchu City",
    "新竹縣": "Hsinchu",
    "宜蘭縣": "Yilan",
    "基隆市": "Keelung City",
    "苗栗縣": "Miaoli",
    "臺北市": "Taipei City",
    "新北市": "New Taipei City",
    "桃園縣": "Taoyuan",
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
    "Taoyuan": "桃園縣",
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

async function main()
{
    let weatherSystem = new WeatherSystem();
    let user = new User();
    await user.init();
    weatherSystem.setupTooltips();
    console.log(user.location);
    weatherSystem.getRecords();
    $(".Taiwan path").on("click", (e) => {
        WeatherSystem.setSelectedLocation(e.target);
    });
}