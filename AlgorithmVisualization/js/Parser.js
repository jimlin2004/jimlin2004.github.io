import {BinarySearchTree} from "./BinarySearchTree.js"
import {Queue} from "../../js/DataStructure.js"

class Node
{
    constructor(parent, child)
    {
        this.parent = parent;
        this.child = child;
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
        let levels = [];
        let currentNode = null;
        while (!this.queue.empty())
        {
            currentNode = this.queue.front();
            this.queue.pop();
            
        }
    }
};

export {Parser}