let template = document.createElement("template");
template.innerHTML = `
<style>
    .wrap {
        position: fixed;
        display: flex;
        z-index: 4;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        justify-content: center;
        align-items: center;
    }
    .modal {
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        box-shadow: 0 0 3px #000;
        background-color: #fff;
        min-width: 20%;
        max-height: 80%;
        transition: all 0.3s;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #000;
    }
    .modal-header .modal-title {
        padding-left: 5px;
    }
    .modal-header .modal-close {
        font-size: 16px;
        border: none;
        background-color: transparent;
        color: #f25757;
        cursor: pointer;
        transition: 0.3s;
    }
    .modal-header .modal-close:hover {
        color: rgb(242, 87, 87, 0.5);
    }
    .modal-container {
        padding: 5px;
        border-bottom: 1px solid #000;
        overflow-y: auto;
    }
    .modal-footer {
        padding: 5px;
    }
</style>
<div class = "wrap">
    <div class = modal>
        <div class = "modal-header">
            <div class = "modal-title">title</div>
            <button class = "modal-close">X</button>
        </div>
        <div class = "modal-container">
            <slot name = "modal-container-slot">
                內文
            </slot>
        </div>
        <div class = "modal-footer">
            <button class = "modal-footer-close">close</button>
        </div>
    </div>
</div>
`;

class Modal extends HTMLElement
{
    constructor()
    {
        super();

        this._shadowRoot = this.attachShadow({mode: "open"});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.setTitle();
        this.shadowRoot.querySelector(".modal").style.transform = "scale(0)";
        this.shadowRoot.querySelector(".wrap").style.display = "none";
    }

    setTitle()
    {
        this.shadowRoot.querySelector(".modal-title").innerHTML = this.getAttribute("title");
        this.handleEvent();
    }

    open()
    {
        this.shadowRoot.querySelector(".wrap").style.display = "flex";
        let modal = this.shadowRoot.querySelector(".modal");
        modal.style.transform = "scale(0)";
        setTimeout(() => {
            modal.style.transform = "scale(1)";
        }, 0);
    }

    close()
    {
        this.shadowRoot.querySelector(".modal").style.transform = "scale(0)";
        setTimeout(() => {
            this.shadowRoot.querySelector(".wrap").style.display = "none";
        }, 300);
    }

    handleEvent()
    {
        this.shadowRoot.querySelector(".modal-close").addEventListener("click", () => {this.close()});
        this.shadowRoot.querySelector(".modal-footer-close").addEventListener("click", () => {this.close()});
    }
};

customElements.define("cpt-modal", Modal);