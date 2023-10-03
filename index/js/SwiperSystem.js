import {Cat} from "./Cat.js"

class Label
{
    constructor(div, title, titleColor, link, description, completeDescription, img)
    {
        this.div = div;
        this.title = title;
        this.titleColor = titleColor;
        this.link = link;
        this.description = description;
        this.completeDescription = completeDescription;
        this.img = img;

        this.htmlElement = null;
    }

    createLabel()
    {
        let label_item = document.createElement("div");
        label_item.classList.add("labels_item");
        
            let label_title = document.createElement("p");
            label_title.classList.add("label_title");
            label_title.innerText = this.title;
            label_title.style.backgroundColor = this.titleColor;
            label_item.appendChild(label_title);

            let label_pushpin = document.createElement("img");
            label_pushpin.src = "./img/pushpin.png";
            label_pushpin.className = "pushpin";
            label_title.appendChild(label_pushpin);

            let label_content = document.createElement("div");
            label_content.classList.add("label_content");
            label_item.appendChild(label_content);
                let label_content_text = document.createElement("div");
                SwiperSystem.splitTextToP(label_content_text, this.description);
                label_content_text.classList.add("label_content_text");
                label_content.appendChild(label_content_text);

                let label_img_wrap = document.createElement("div");
                label_img_wrap.classList.add("label_img_wrap");
                label_content.appendChild(label_img_wrap);
                    let label_img = document.createElement("img");
                    label_img.classList.add("label_img");
                    label_img.src = this.img;
                    label_img_wrap.appendChild(label_img);

        return this.htmlElement = label_item;
    }
};

class SwiperSystem
{
    constructor()
    {
        this.labels = new Map();
        this.currentIndex = 0;
        this.cat = new Cat();
        this.labels_data = [];
        this.maxHeight = 0;
    }

    pushNewLabel(label_div, title, titleColor, link, description, completeDescription, img)
    {
        this.labels.set(label_div.id, new Label(label_div, title, titleColor, link, description, completeDescription, img));
    }

    getLabelsMaxHeight(labelDatas)
    {
        let body = document.getElementsByTagName("body")[0];
        for (let labelData of labelDatas)
        {
            let label = new Label(null, labelData["title"]["title"], labelData["title"]["color"], labelData["href"], labelData["description"], labelData["complete_description"], labelData["img"]);
            label.createLabel();
            label.htmlElement.style.position = "fixed";
            label.htmlElement.style.zIndex = "-1";
            body.appendChild(label.htmlElement);
            this.maxHeight = Math.max(label.htmlElement.getBoundingClientRect().height, this.maxHeight);
            label.htmlElement.remove();
        }
    }

    getLabelNum()
    {
        return this.labels.size;
    }

    handleEvent(div)
    {
        div.addEventListener("click", (e) => {
            let target_div = e.target.closest(".labels_item");
            if (target_div === null) return;
            this.switchToLabel(target_div.id);
        });
    }

    updateLangTabel(label)
    {
        let tabel = document.querySelector("#swiper_container_lang tbody");
        tabel.innerHTML = "";
        let tr = null;
        let td = null;
        for (let lang of label.completeDescription["language"].split('/'))
        {
            tr = document.createElement("tr");
            td = document.createElement("td");
            td.innerHTML = lang;
            tr.appendChild(td);
            tabel.appendChild(tr);
        }
    }

    updateScroll (label)
    {
        let scroll_body = document.querySelector("#swiper_container_description .scroll-body");
        if (scroll_body.classList.contains("active"))
        {
            scroll_body.classList.toggle("active");
        }
        setTimeout(() => {
            SwiperSystem.splitTextToP(document.querySelector("#swiper_container_description .scroll-body .scroll-body-content"), label.completeDescription["description"]);
            scroll_body.classList.toggle("active");
        }, 300);
        
    }

    static splitTextToP(div, text)
    {
        div.innerHTML = ""; //清空
        let splitText = text.split('\n');
        let p = null;
        for (let line of splitText)
        {
            p = document.createElement("p");
            p.innerHTML = line;
            div.appendChild(p);
        }
    }

    switchToLabel(label_id) 
    {
        let label = this.labels.get(label_id);
        document.querySelector("#swiper_container_title p").innerHTML = label.title;
        this.updateLangTabel(label);
        document.querySelector("#swiper_container #swiper_container_link a").href = label.link;
        this.cat.setSaid(label.title);
        this.cat.updateSaid(document.getElementById("cat_said_content"));
        this.updateScroll(label);
    }

    setLabelsHeight()
    {
        let labels_div = document.getElementById("labels");
        labels_div.style.minHeight = `${this.maxHeight}px`;
    }
};

export {SwiperSystem};