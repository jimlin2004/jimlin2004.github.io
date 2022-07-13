export class Node
{
    constructor(val)
    {
        this.val = val;
        this.left = null;
        this.right = null;
    }
};

export class BinarySearchTree
{
    constructor()
    {
        this.root = null;
    }

    insert(val)
    {
        if (this.root === null)
        {
            this.root = new Node(value)
            return this;
        }
        let current = this.root;
        while (true)
        {
            if (val < current.val)
            {
                if (current.left === null)
                {
                    current.left = new Node(val);
                    return this;
                }
                current = current.left;
            }
            else if (val > current.val)
            {
                if (current.right === null)
                {
                    current.right = new Node(val);
                    return this;
                }
                current = current.right;
            }
            else
                return false;
        }
    }
}