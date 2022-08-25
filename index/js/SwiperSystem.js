import {Cat} from "./Cat.js"

class Label
{
    constructor(div, title, completeDescription)
    {
        this.div = div;
        this.title = title;
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

    async loadAllHtml()
    {

    }

    pushNewLabel(label_div, title, completeDescription)
    {
        this.labels.set(label_div.id, new Label(label_div, title, completeDescription));
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

    switchToLabel(label_id) 
    {
        let label = this.labels.get(label_id);
        document.querySelector("#swiper_container_title p").innerHTML = label.title;
        this.updateLangTabel(label);
        this.cat.setSaid(label.title);
        this.cat.updateSaid(document.getElementById("cat_said_content"));
    }

    update()
    {
        
    }
};

export {SwiperSystem};