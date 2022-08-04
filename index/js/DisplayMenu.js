import data from "../displayMenu.json" assert {type: "json"}

class DisplayMenu
{
    constructor()
    {
        this.data = data;
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

    addToHTML()
    {
        let labels_div = document.getElementById("labels");
        let labels_item_div = null;
        let label_title_p = null;
        let label_content_div = null;
        for (let item of this.data["labels"])
        {
            labels_item_div = document.createElement("div");
            labels_item_div.className = "labels_item";
            label_title_p = document.createElement("p");
            label_title_p.id = "label_title";
            label_title_p.innerHTML = item["title"]["title"];
            label_title_p.style.backgroundColor = item["title"]["color"];
            label_content_div = document.createElement("div");
            label_content_div.id = "label_content";
            // label_content_div.innerHTML = item["description"];
            this.splitTextToP(label_content_div, item["description"]);
            labels_item_div.appendChild(label_title_p);
            labels_item_div.appendChild(label_content_div);
            labels_div.appendChild(labels_item_div);
        }
    }
};

$(function() {
    let displayMenu = new DisplayMenu("displayMenu.json");
    displayMenu.addToHTML();
});