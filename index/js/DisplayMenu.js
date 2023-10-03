// import data from "../displayMenu.json" assert {type: "json"}
//上條ios safari 不支援
import { SwiperSystem } from "./SwiperSystem.js"

class DisplayMenu
{
    constructor()
    {
        this.data = null;
        this.swiper = new SwiperSystem();
        this.currentImgIndexStart = 0;
    }

    async loadJson()
    {
        let res = await fetch("displayMenu.json");
        this.data = await res.json();
        return;
    }

    splitTextToP(div, text)
    {
        let splitText = text.split('\n');
        let p = null;
        for (let line of splitText)
        {
            p = document.createElement("p");
            p.innerHTML = line;
            div.appendChild(p);
        }
    }

    checkImgIndex(index)
    {
        if (index >= this.data["labels"].length)
            return index - this.data["labels"].length;
        else if (index < 0)
            return this.data["labels"].length - 1;
        return index;
    }

    updateLabel()
    {
        let label_items = document.getElementById("labels").querySelectorAll(".labels_item");
        let currentImgIndex = 0;
        let labelData = null;
        let labels_item_div = null;
        let label_title_p = null;
        let label_pushpin = null;
        let label_content_text_div = null;
        let label_img = null;
        for (let i = 0; i < 3; i++)
        {
            currentImgIndex = this.checkImgIndex(this.currentImgIndexStart + i);
            labelData = this.data["labels"][currentImgIndex];
            labels_item_div = label_items[i];
            labels_item_div.id = labelData["id"];
            label_title_p = labels_item_div.querySelector(".label_title");
            label_title_p.innerHTML = labelData["title"]["title"];
            label_title_p.style.backgroundColor = labelData["title"]["color"];
            label_pushpin = document.createElement("img");
            label_pushpin.src = "./img/pushpin.png";
            label_pushpin.className = "pushpin";
            label_title_p.appendChild(label_pushpin);
            label_content_text_div = labels_item_div.querySelector(".label_content_text");
            label_content_text_div.innerHTML = "";
            this.splitTextToP(label_content_text_div, labelData["description"]);
            label_img = labels_item_div.querySelector(".label_img");
            label_img.src = labelData["img"];
            this.swiper.pushNewLabel(labels_item_div, labelData["title"]["title"], labelData["title"]["color"], labelData["href"], labelData["description"], labelData["complete_description"], labelData["img"]);
        }
        return;
    }

    ToPreviousLabel()
    {
        this.currentImgIndexStart--;
        if (this.currentImgIndexStart < 0)
        {
            this.currentImgIndexStart = this.data["labels"].length - 1;
        }
        this.updateLabel();
        return;
    }

    ToNextLabel()
    {
        this.currentImgIndexStart++;
        if (this.currentImgIndexStart >= this.data["labels"].length)
        {
            this.currentImgIndexStart = 0;
        }
        this.updateLabel();
        return;
    }
};

//<execute>
let displayMenu = new DisplayMenu();
let bnt_previous = document.getElementById("bnt_previous");
let bnt_next = document.getElementById("bnt_next");
bnt_previous.addEventListener("click", () => {
    displayMenu.ToPreviousLabel();
})
bnt_next.addEventListener("click", () => {
    displayMenu.ToNextLabel();
})
displayMenu.loadJson()
    .then(() => {
        displayMenu.swiper.getLabelsMaxHeight(displayMenu.data["labels"]);
        displayMenu.swiper.setLabelsHeight();
        displayMenu.updateLabel();
        displayMenu.swiper.handleEvent(document.getElementById("labels"));
    });
//</execute>