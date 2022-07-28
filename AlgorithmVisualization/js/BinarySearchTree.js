class Node_BST
{
    constructor(val)
    {
        this.val = val;
        this.left = null;
        this.right = null;
    }
    getChild() //return child->type: array
    {
        let _arr = [];
        _arr.push(this.left);
        _arr.push(this.right);
        return _arr;
    }
};

class BinarySearchTree
{
    constructor()
    {
        this.root = null;
    }

    getHead()
    {
        return this.root;
    }

    clear()
    {
        this.root = null;
    }

    insert(val)
    {
        if (this.root === null)
        {
            this.root = new Node_BST(val)
            return this;
        }
        let current = this.root;
        while (true)
        {
            if (val < current.val)
            {
                if (current.left === null)
                {
                    current.left = new Node_BST(val);
                    return this;
                }
                current = current.left;
            }
            else if (val > current.val)
            {
                if (current.right === null)
                {
                    current.right = new Node_BST(val);
                    return this;
                }
                current = current.right;
            }
            else
                return false;
        }
    }

    dfs(root)
    {
        if (root === null)
        {
            // console.log(null);
            return;
        }
        // console.log(root.val);
        this.dfs(root.left);
        this.dfs(root.right);
    }

    print()
    {
        this.dfs(this.root);
        return;
    }

    parse(data)
    {
        let reg = /^[\d]+$/;
        for (let val of data)
        {
            if (reg.test(val))
                val = parseInt(val);
            this.insert(val);
        }
    }
};

export {BinarySearchTree};