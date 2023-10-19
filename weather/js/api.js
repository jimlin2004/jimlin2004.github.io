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

let weatherData = {};

function getRecords()
{
    if (weatherData === null)
    {
        throw new Error("氣象資料為空");
    }
    let weatherMap = new Map();
    for (let weather of weatherData["records"]["location"])
    {
        weatherMap.set(weather["locationName"], new Weather(weather["weatherElement"][0], weather["weatherElement"][1], 
            weather["weatherElement"][2], weather["weatherElement"][3], weather["weatherElement"][4]));
    }

    console.log(weatherMap);
}


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

function main()
{
    getRecords();
}