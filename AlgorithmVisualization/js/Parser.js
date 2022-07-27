import {BinarySearchTree} from "./BinarySearchTree.js"
import {Queue} from "../../js/DataStructure.js"

class Node
{
    constructor(elementID, child)
    {
        this.elementID = elementID; //上一個level的元素編號
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

class ElementID
{
    constructor(parentID, index)
    {
        this.parentID = parentID;
        this.index = index;
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
        let parentID = 1;
        let elementID = new ElementID(-1, 1);
        level.push(new Node(elementID, this.queue.front()))
        this.levels.push(level); //將第一層加入levels
        let index = 0;
        while (!this.queue.empty())
        {
            level = new Level(); //clear
            parentID = 1; //init
            for (let i = 0; i < levelWidth; i++)
            {
                currentNode = this.queue.front();
                this.queue.pop();
                child = currentNode.getChild();
                index = 1;
                for (let node of child)
                {
                    if (node !== null)
                    {
                        this.queue.push(node);
                    }
                    level.push(new Node(new ElementID(parentID, index), node));
                    index++;
                }
                parentID++;
                index = 1;
            }
            // console.log(level);
            levelWidth = this.queue.size;
            this.levels.push(level);
        }
        console.log(this.levels);
        return;
    }
};

export {Parser}