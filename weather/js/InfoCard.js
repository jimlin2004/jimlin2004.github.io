import { Converter } from "./Converter.js";

class InfoCard
{
    /*
        parameter
            infoCard: html infoCard本身
            timeDescription: 時間描述 string
            weatherDescription: 天氣描述 string
            temperatureMin: 最低溫(華氏) string
            temperatureMax: 最高溫(華氏) string
            pop: 降雨機率(%) string
    */
    static updateInfoCard(infoCard, timeDescription, weatherDescription, temperatureMin, temperatureMax, pop)
    {
        infoCard.querySelector(".time-title").textContent = timeDescription;
        infoCard.querySelector(".weatherIcon").src = `./assets/svg/weatherDescription/${Converter.getWeatherIcon(weatherDescription)[0]}`;
        infoCard.querySelector(".temperature").textContent = `${temperatureMin} ~ ${temperatureMax} °C`;
        infoCard.querySelector(".popDiv .pop-text").textContent = `${pop}%`;
        infoCard.querySelector(".weatherDescription").textContent = weatherDescription;
    }
};

export {InfoCard};