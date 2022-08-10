class Cat
{
    constructor()
    {
        this.said = null;
    }

    setSaid(text)
    {
        this.said = text;
        return;
    }

    updateSaid(div)
    {
        div.innerHTML = `這是 ${this.said}`;
        return;
    }
};

export {Cat};