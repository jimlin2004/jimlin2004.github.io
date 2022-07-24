class QueueNode
{
    constructor(val)
    {
        this.val = val;
        this.next = null;
    }
};

class Queue
{
    constructor()
    {
        this._first = null;
        this._last = null;
        this.size = 0;
    }

    clear()
    {
        this._first = null;
        this._last = null;
        this.size = 0;
    }

    push(val)
    {
        let newNode = new QueueNode(val);
        if (this.size === 0)
        {
            this._first = newNode;
            this._last = newNode;
        }
        else
        {
            console.log(newNode);
            this._last.next = newNode;
            this._last = newNode;
        }
        this.size++;
        return;
    }

    pop()
    {
        if (this._size === 0)
            return;
        let targetNode = this._first;
        if (this._first === this._last)
            this._last = null;
        this._first = targetNode.next;
        this.size--;
        return;
    }

    front()
    {
        return this._first.val;
    }

    back()
    {
        return this._last.val;
    }

    empty()
    {
        return (this.size === 0);
    }

    print()
    {
        let current = this._first;
        while (current)
        {
            console.log(current.val);
            current = current.next;
        }
    }
};

export {Queue};
// let obj = new Queue();
// obj.print();
// obj.push(1);
// obj.push(2);
// obj.push(3);
// console.log(obj.front());
// obj.print();
// obj.pop();
// console.log(obj.front());
// obj.print();