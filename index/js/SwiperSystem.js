import {Cat} from "./Cat.js"

class Label
{
    constructor(div, title, content)
    {
        this.div = div;
        this.title = title;
        this.content = content;
    }
};

class SwiperSystem
{
    constructor()
    {
        this.labels = new Map();
        this.currentIndex = 0;
        this.swiperContainer = document.getElementById("swiper_container");
        this.cat = new Cat();
    }

    pushNewLabel(label_div, title, content)
    {
        this.labels.set(label_div.id, new Label(label_div, title, content));
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

    switchToLabel(label_id) 
    {
        let label = this.labels.get(label_id);
        this.swiperContainer.innerHTML = label.content;
        this.cat.setSaid(label.title);
        this.cat.updateSaid(document.getElementById("cat_said_content"));
    }

    update()
    {

    }
};

export {SwiperSystem};