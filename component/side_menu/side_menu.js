class SideMenu
{
    constructor()
    {

    }

    insertToHtml(text)
    {
        document.getElementById("side_menu").innerHTML = text;
        return;
    }

    async load()
    {
        let res = await fetch("../component/side_menu/side_menu.html");
        let text = await res.text();
        this.insertToHtml(text);
        return;
    }
}

//run
let side_menu = new SideMenu();
side_menu.load();