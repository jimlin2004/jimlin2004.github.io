class Header
{
    constructor()
    {

    }

    handleEvent()
    {
        document.getElementById("burger").addEventListener("click", () => {
            let burger = document.getElementById("burger");
            document.getElementById("side_menu").classList.toggle("active");
            if (burger.classList.contains("fa-navicon"))
            {
                burger.classList.remove("fa", "fa-fw", "fa-navicon");
                burger.classList.add("fa-solid", "fa-fw", "fa-xmark");
            }
            else
            {
                burger.classList.remove("fa-solid", "fa-fw", "fa-xmark");
                burger.classList.add("fa", "fa-fw", "fa-navicon");
            }
        });
        document.getElementsByTagName("header")[0].querySelector("#warning").addEventListener("click", () => {
            
        });
    }

    insertToHeader(text)
    {
        document.getElementsByTagName("header")[0].innerHTML =  text;
        return;
    }

    async load()
    {
        let res = await fetch("../component/header/header.html");
        let text = await res.text();
        this.insertToHeader(text);
        this.handleEvent();
        return;
    }
};

//run
let header = new Header();
header.load();