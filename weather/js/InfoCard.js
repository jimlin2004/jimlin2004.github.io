import { Converter } from "./Converter.js";

class InfoCard
{
    static create(weatherDescription, temperatureMin, temperatureMax)
    {
        let infoCardDiv = document.createElement("div");
        infoCardDiv.classList.add("info-card");

        let timeP = document.createElement("p");
        timeP.textContent = "今夜明晨";
        timeP.classList.add("time-title");
        infoCardDiv.appendChild(timeP);

        let weatherIcon = document.createElement("img");
        weatherIcon.src = `./assets/svg/weatherDescription/${Converter.getWeatherIcon(weatherDescription)[0]}`;
        infoCardDiv.appendChild(weatherIcon);

        let temperatureP = document.createElement("p");
        temperatureP.textContent = `${temperatureMin} ~ ${temperatureMax} °C`;
        infoCardDiv.appendChild(temperatureP);

        return infoCardDiv;
    }
};

export {InfoCard};