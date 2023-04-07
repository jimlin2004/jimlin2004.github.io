import {Cookie} from "../../js/Cookie.js"

let sideMenu_template = document.createElement("template");
sideMenu_template.innerHTML = `
<link rel = "stylesheet" href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">

<style>
    #side_menu {
        position: absolute;
        /* width: 20%; */
        height: 100%;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        background-color: #49d59f;
        box-shadow: -5px 0 3px hsla(177, 71%, 27%, 0.5);
        box-sizing: border-box;
        transform: translateX(120%);
        transition: 0.3s;
    }
    
    #side_menu.active {
        transform: translateX(0);
    }
    
    #side_menu #user_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 10px;
        border-bottom-style: dotted;
        border-bottom-color: rgba(0, 0, 0, 0.626); 
    }
    
    #side_menu #user_info i {
        font-size: 150%;
    }
    #side_menu #user_info #user_info_panel a {
        text-decoration: none;
        color: #fff;
        transition: 0.3s;
        cursor: pointer;
    }
    
    #side_menu #user_info #user_info_panel a:hover {
        color: #ff9500;
        font-weight: bold;
    }
    
    #side_menu nav a {
        display: block;
        padding: 10px;
        color: #fff;
        text-decoration: none;
        position: relative;
        font-size: 100%;
        transition: 0.3s;
    }
    
    #side_menu nav a + a::before {
        content: "";
        position: absolute;
        border-top: 1px solid #fff;
        left: 10px;
        right: 10px;
        top: 0;
    }
    
    #side_menu nav a:hover {
        /* font-size: 120%; */
        color: #ff9500;
        font-weight: bold;
        background-color: #2d3142;
    }
</style>

<div id = "side_menu">
    <div id = "user_info">
        <i class="fa fa-user-circle"></i>
        <div id = "user_info_panel">
            <a href = "../login/login.html" id = "a_login">登入</a>
        </div>
    </div>
    <nav>
        <a href = "../AlgorithmVisualization/AlgorithmVisualization.html" id = "a_AlgorithmVisualization">演算法視覺化</a>
        <a href = "../baseConverter/baseConverter.html" id = "a_BaseConverter">進制線上轉換器</a>
        <a href = "../games/Snake/Snake.html" id = "a_snake">貪食蛇</a>
        <a href = "../index/index.html" id = "a_home">回到首頁</a>
    </nav>
</div>
`

class CPT_SideMenu extends HTMLElement
{
    constructor()
    {
        super();

        this._shadowRoot = this.attachShadow({mode: "open"});
        this._shadowRoot.appendChild(sideMenu_template.content.cloneNode(true));
    }

    update()
    {
        this.shadowRoot.querySelector('#side_menu').classList.toggle("active");
    }

    setUserInfo()
    {
        if (Cookie.get("username").length !== 0)
        {
            let panel = this.shadowRoot.querySelector("#user_info_panel");
            panel.innerHTML = `
                <div>${Cookie.get("username")}</div>
                <a id = "sign_out">登出</a>
            `;
            this.shadowRoot.querySelector("#sign_out").addEventListener("click", () => {
                Cookie.deleteAll();
                window.location.reload();
            });
        }
    }

    connectedCallback()
    {
        this.setUserInfo();
    }
};

customElements.define("cpt-sidemenu", CPT_SideMenu);