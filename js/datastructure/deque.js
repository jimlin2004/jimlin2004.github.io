class DequeNode
{
    constructor(_data)
    {
        this.data = _data;
        this.previous = this.next = null;
    }
};

class Deque
{
    constructor()
    {
        this.first = this.last = null;
    }
    push_front(_data)
    {
        if (!this.first)
            this.first = this.last = new DequeNode(_data);
        else
        {
            this.first.previous = new DequeNode(_data);
            this.first.previous.next = this.first;
            this.first = this.first.previous;
        }
    }
    front()
    {
        if (!this.first)
            return null;
        return this.first.data;
    }
    pop_front()
    {
        if (this.first === this.last)
        {
            this.first = this.last = null;
        }
        else
        {
            this.first.next.previous = null;
            delete this.first.data;
            this.first = this.first.next;
        }
    }
    push_back(_data)
    {
        if (!this.first)
            this.first = this.last = new DequeNode(_data);
        else
        {
            this.last.next = new DequeNode(_data);
            this.last.next.previous = this.last;
            this.last = this.last.next;
        }
    }
    back()
    {
        if (!this.last)
            return null;
        return this.last.data;
    }
    pop_back()
    {
        if (this.last === this.first)
        {
            this.first = this.last = null;
        }
        else
        {
            this.last.previous.next = null;
            delete this.last.data;
            this.last = this.last.previous;
        }
    }
};

export {Deque};

//test
// let deque = new Deque();
// deque.push_front(1);
// console.log(deque.front());
// console.log(deque.back());
// deque.push_back(2);
// console.log(deque.front());
// console.log(deque.back());
// deque.push_front(0);
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_front();
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_back();
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_front();
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_front();
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_back();
// console.log(deque.front());
// console.log(deque.back());
// deque.push_back(1);
// console.log(deque.front());
// console.log(deque.back());
// deque.pop_front();
// console.log(deque.front());
// console.log(deque.back());