class Label
{
    constructor(div, content)
    {
        this.div = div;
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
    }

    pushNewLabel(label_div, content)
    {
        this.labels.set(label_div.id, new Label(label_div, content));
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
    }

    update()
    {

    }
};

export {SwiperSystem};