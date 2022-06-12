class Obj
{
    constructor()
    {
        this.val = 0;
        this.dict = new Map();
    }
    set_val(val)
    {
        this.val = val;
    }
    add_val(val)
    {
        this.dict.set("1", "one");
    }
    see_dict()
    {
        console.log(this.dict);
    }
}

let obj = new Obj();

console.log(obj.val);
obj.set_val(1);
console.log(obj.val);
obj.add_val(1);
console.log(obj.dict);
obj.see_dict();