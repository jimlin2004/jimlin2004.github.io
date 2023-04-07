class SideMenu
{
    constructor()
    {
        this.userInfo = new Map();
    }

    insertToHtml(text)
    {
        document.getElementById("side_menu").innerHTML = text;
        return;
    }

    setUserInfo()
    {
        for (let cookie of document.cookie.split("; "))
        {
            let pair = cookie.split("=");
            this.userInfo.set(pair[0], pair[1]);
        }

        
    }

    async load()
    {
        let res = await fetch("../component/side_menu/side_menu.html");
        let text = await res.text();
        this.insertToHtml(text);
        this.setUserInfo();
        return;
    }
}

//run
let side_menu = new SideMenu();
side_menu.load();