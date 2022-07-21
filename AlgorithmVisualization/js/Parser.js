import {BinarySearchTree} from "./BinarySearchTree.js"

class Parser
{
    constructor(type)
    {
        this.type = type;
        this.dataStruct = {
            "BinarySearchTree": new BinarySearchTree()
        };
        this.currentDataStruct = null;
    }

    setType(type)
    {
        this.type = type;
    }

    parse(data)
    {
        data = data.split(" ");
        this.currentDataStruct = this.dataStruct[this.type];
        console.log(this.dataStruct);
        this.currentDataStruct.parse(data);
    }
};

export {Parser}