import {BinarySearchTree} from "./BinarySearchTree.js"
import {Queue} from "../../js/DataStructure.js"

class Node
{
    constructor(parentID, child)
    {
        this.parentID = parentID;//上一個level的元素編號
        this.child = child;
    }
};

class Level
{
    constructor()
    {
        this.sizeWithoutNull = 0;
        this.nodes = [];
    }

    getSizeIncludingNull()
    {
        return this.nodes.length;
    }

    getSizeWithoutNull()
    {
        return this.nodes.sizeWithoutNull;
    }

    push(node)
    {
        if (node.child !== null)
            this.sizeWithoutNull++;
        this.nodes.push(node);
        return;
    }
};

class Parser
{
    constructor(type)
    {
        this.type = type;
        this.queue = new Queue();
        this.levels = [];
        this.dataStruct = {
            "BinarySearchTree": new BinarySearchTree()
        };
        this.currentDataStruct = null;
    }

    clear()
    {
        if (this.type !== '')
        {
            if (this.currentDataStruct.clear !== undefined)
                this.currentDataStruct.clear();
            this.levels = [];
        }
    }

    setType(type)
    {
        this.type = type;
    }

    parse(data)
    {
        data = data.split(" ");
        this.currentDataStruct = this.dataStruct[this.type];
        this.currentDataStruct.parse(data);
        this.currentDataStruct.print()
    }

    getLevels()
    {
        this.queue.push(this.currentDataStruct.getHead());
        let currentNode = null;
        let level = new Level();
        let child = [];
        let levelWidth = this.queue.size;
        let elementID = 1;
        level.push(new Node(-1, this.queue.front()))
        this.levels.push(level); //將第一層加入levels
        while (!this.queue.empty())
        {
            level = new Level(); //clear
            elementID = 1; //init
            for (let i = 0; i < levelWidth; i++)
            {
                currentNode = this.queue.front();
                this.queue.pop();
                child = currentNode.getChild();
                for (let node of child)
                {
                    if (node !== null)
                        this.queue.push(node);
                    level.push(new Node(elementID, node));
                }
                elementID++;
            }
            // console.log(level);
            levelWidth = this.queue.size;
            this.levels.push(level);
        }
        return;
    }
};

export {Parser}