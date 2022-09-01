import {Cat} from "./Cat.js"

class Label
{
    constructor(div, title, link, completeDescription)
    {
        this.div = div;
        this.title = title;
        this.link = link;
        this.completeDescription = completeDescription;
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
    }

    pushNewLabel(label_div, title, link, completeDescription)
    {
        this.labels.set(label_div.id, new Label(label_div, title, link, completeDescription));
        return;
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
            this.splitTextToP(document.querySelector("#swiper_container_description .scroll-body .scroll-body-content"), label.completeDescription["description"]);
            scroll_body.classList.toggle("active");
        }, 300);
        
    }

    splitTextToP(div, text)
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

    update()
    {
        
    }
};

export {SwiperSystem};