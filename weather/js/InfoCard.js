class InfoCard
{
    static create()
    {
        let infoCardDiv = document.createElement("div");
        infoCardDiv.classList.add("info-card");

        let timeP = document.createElement("p");
        timeP.textContent = "今夜明晨";
        infoCardDiv.appendChild(timeP);

        let weatherIcon = document.createElement("img");
        weatherIcon.src = "./assets/svg/sun.svg";
        weatherIcon.style.width = "50px";
        infoCardDiv.appendChild(weatherIcon);

        return infoCardDiv;
    }
};

export {InfoCard};